'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { MessageSquare, Image } from 'lucide-react';
import { LineUser } from '../../../types/line';
import { MessageLogs } from '@/components/admin/line/MessageLogs';

type MessageType = 'text' | 'image';

interface MessageForm {
  type: MessageType;
  text: string;
  imageUrl?: string;
  targetUserIds?: string[];
}

const messageTypes = [
  { 
    value: 'text', 
    label: 'テキストメッセージ',
    icon: MessageSquare,
    description: 'テキストを送信します'
  },
  { 
    value: 'image', 
    label: '画像メッセージ',
    icon: Image,
    description: '画像URLを指定して画像を送信します'
  },
];

export default function MessagesPage() {
  const [users, setUsers] = useState<LineUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch, reset } = useForm<MessageForm>();
  const selectedType = watch('type');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: MessageForm) => {
    try {
      // バリデーション
      if (selectedUsers.length === 0) {
        toast.error('送信先ユーザーを選択してください');
        return;
      }

      if (data.type === 'text' && (!data.text || data.text.trim() === '')) {
        toast.error('メッセージの内容を入力してください');
        return;
      }

      if (data.type === 'image' && (!data.imageUrl || !data.imageUrl.startsWith('https://'))) {
        toast.error('有効な画像URLを入力してください');
        return;
      }

      // 送信データの準備
      const requestData = {
        ...data,
        targetUserIds: selectedUsers,
      };
      console.log('Sending request:', requestData);

      const response = await fetch('/api/admin/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '送信に失敗しました');
      }

      toast.success('メッセージを送信しました');
      reset();
      // 送信ログを更新
      if (typeof window !== 'undefined') {
        (window as any).refreshMessageLogs?.();
      }
    } catch (error) {
      toast.error('エラーが発生しました');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* メッセージ送信フォーム */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              メッセージ送信
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
              {/* メッセージタイプ選択 */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-900">
                  メッセージタイプ
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {messageTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <label
                        key={type.value}
                        className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedType === type.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('type')}
                          value={type.value}
                          className="sr-only"
                        />
                        <Icon className={`w-8 h-8 mb-2 ${
                          selectedType === type.value
                            ? 'text-indigo-500'
                            : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          selectedType === type.value
                            ? 'text-indigo-700'
                            : 'text-gray-900'
                        }`}>
                          {type.label}
                        </span>
                        <span className="text-xs text-gray-500 text-center mt-1">
                          {type.description}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* ユーザー選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  送信先ユーザー
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={(e) => setSelectedUsers([e.target.value])}
                >
                  <option value="">送信先を選択してください</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName || user.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* テキストメッセージ入力 */}
              {selectedType === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    メッセージ内容
                  </label>
                  <textarea
                    {...register('text')}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="メッセージを入力してください"
                  />
                </div>
              )}

              {/* 画像メッセージ入力 */}
              {selectedType === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    画像URL
                  </label>
                  <input
                    type="url"
                    {...register('imageUrl')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {/* 送信ボタン */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  送信
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 送信ログ */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              送信ログ
            </h3>
            <div className="mt-5">
              <MessageLogs autoRefresh={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
