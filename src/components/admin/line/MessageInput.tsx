'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      const response = await fetch('/api/admin/line/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('送信に失敗しました');

      toast.success('メッセージを送信しました');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('送信に失敗しました');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力"
            className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={3}
            disabled={sending}
          />
        </div>
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="px-6 py-3 bg-[#00B900] text-white rounded-full font-medium hover:bg-[#009900] focus:outline-none focus:ring-2 focus:ring-[#00B900] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? '送信中...' : '送信'}
        </button>
      </form>
    </div>
  );
}
