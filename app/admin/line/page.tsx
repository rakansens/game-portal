'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function LineMessagingPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('/api/admin/line/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }

      toast.success('メッセージを送信しました');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('メッセージの送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">LINE一斉送信</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            メッセージ
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="送信するメッセージを入力してください"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '送信中...' : '送信'}
        </button>
      </form>
    </div>
  );
}
