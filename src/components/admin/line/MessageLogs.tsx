import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Image } from 'lucide-react';

import { Database } from '@/types/database';

type MessageGroup = Database['public']['Tables']['message_groups']['Row'] & {
  messages: Database['public']['Tables']['message_logs']['Row'][];
};

interface FormattedLog {
  id: string;
  message_type: string;
  message_content: any;
  target_users: any;
  status: string;
  error_message: string | null;
  created_at: string;
  created_by: string | null;
  is_broadcast: boolean;
  additional_messages?: Database['public']['Tables']['message_logs']['Row'][];
}

interface Props {
  autoRefresh?: boolean;
}

export const MessageLogs = ({ autoRefresh = false }: Props) => {
  const [logs, setLogs] = useState<FormattedLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      console.log('Fetching message logs from API...');
      const response = await fetch('/api/admin/messages/logs');
      console.log('API Response status:', response.status);
      
      const data = await response.json();
      console.log('API Response data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        throw new Error(data.error || '送信ログの取得に失敗しました');
      }
      if (Array.isArray(data)) {
        setLogs(data);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        console.error('Unexpected data format:', data);
        throw new Error('予期しないデータ形式です');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error(error instanceof Error ? error.message : '送信ログの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // メッセージ送信時に更新するための関数を外部に公開
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshMessageLogs = fetchLogs;
    }
  }, []);

  if (loading) {
    return <div className="text-gray-700">読み込み中...</div>;
  }

  if (logs.length === 0) {
    return <div className="text-gray-700">送信ログはまだありません</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              送信日時
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              タイプ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              内容
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              送信先
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              ステータス
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Date(log.created_at).toLocaleString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {log.message_type === 'text' ? (
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  ) : log.message_type === 'image' ? (
                    <Image className="w-5 h-5 text-green-500" />
                  ) : null}
                  <span className="ml-2 text-sm text-gray-700">
                    {log.message_type === 'text' ? 'テキスト' : 'イメージ'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {log.message_type === 'text' ? (
                  <div className="text-sm text-gray-700 max-w-md break-words">
                    {(log.message_content as { text: string })?.text}
                  </div>
                ) : log.message_type === 'image' ? (
                  <div className="flex items-center space-x-2">
                    <img
                      src={(log.message_content as { imageUrl: string })?.imageUrl}
                      alt="送信画像"
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="text-sm text-gray-500">画像を送信</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">不明なメッセージタイプ</span>
                )}
                {log.additional_messages && log.additional_messages.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    +{log.additional_messages.length}件のメッセージ
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.is_broadcast ? (
                  <span className="text-sm text-gray-700">全員</span>
                ) : (
                  Array.isArray(log.target_users) ? (
                    <div className="flex items-center gap-2">
                      {(log.target_users as { id: string; display_name?: string; picture_url?: string }[]).map(user => (
                        <div key={user.id} className="flex items-center">
                          {user.picture_url ? (
                            <img src={user.picture_url} alt="" className="h-6 w-6 rounded-full" />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-200" />
                          )}
                          <span className="ml-2 text-sm text-gray-700">
                            {user.display_name || user.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">不明</span>
                  )
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span
                    className={`relative flex h-3 w-3 mr-2 ${
                      log.status === 'success' ? '' : 'animate-pulse'
                    }`}
                  >
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        log.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      log.status === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {log.status === 'success' ? '送信成功' : '送信エラー'}
                  </span>
                  {log.error_message && (
                    <span className="ml-2 text-xs text-red-500">
                      {log.error_message}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
