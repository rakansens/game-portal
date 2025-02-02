'use client';

import { useEffect, useState } from 'react';

interface Message {
  id: string;
  message_type: string;
  message_content: string;
  target_type: string;
  target_count: number;
  created_at: string;
}

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/admin/line/messages');
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-500">読み込み中...</div>;
  }

  if (messages.length === 0) {
    return <div className="p-4 text-gray-500">送信履歴はありません</div>;
  }

  return (
    <div className="space-y-4 pb-32">
      {messages.map((message) => (
        <div
          key={message.id}
          className="max-w-[80%] ml-auto bg-[#00B900] text-white rounded-2xl p-4 relative"
        >
          <div className="text-sm mb-1">{message.message_content}</div>
          <div className="text-xs opacity-80">
            {new Date(message.created_at).toLocaleString()} · {message.target_count}人に送信
          </div>
        </div>
      ))}
    </div>
  );
}
