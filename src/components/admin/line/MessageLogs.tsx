import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Database } from '@/types/database';

type MessageLog = Database['public']['Tables']['message_logs']['Row'];

interface Props {
  autoRefresh?: boolean;
}

export const MessageLogs = ({ autoRefresh = false }: Props) => {
  const [logs, setLogs] = useState<MessageLog[]>([]);
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
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Date(log.created_at).toLocaleString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {log.message_type}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {(log.message_content as { text: string })?.text || '不明なメッセージタイプ'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {log.status === 'success' ? '成功' : 'エラー'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
