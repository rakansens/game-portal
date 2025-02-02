import { useEffect, useState } from 'react';

interface MessageLog {
  id: number;
  message_type: string;
  message_content: {
    text?: string;
    url?: string;
  };
  target_users: { id: string }[] | null;
  is_broadcast: boolean;
  status: string;
  error_message?: string;
  created_at: string;
  users?: {
    display_name: string;
  };
}

interface Props {
  autoRefresh?: boolean;
}

export const MessageLogs = ({ autoRefresh = false }: Props) => {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/messages/logs');
      if (!response.ok) {
        throw new Error('送信ログの取得に失敗しました');
      }
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 自動更新が有効な場合、5秒ごとに更新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refresh = () => {
    fetchLogs();
  };

  // コンポーネントの関数を外部に公開
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshMessageLogs = refresh;
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
                {log.message_content.text || (
                  log.message_content.url ? '画像メッセージ' : '不明なメッセージタイプ'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {log.is_broadcast
                  ? '全員'
                  : log.target_users?.map(user => user.id).join(', ')}
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
