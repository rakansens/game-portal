'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { MessageSquare, Image, Plus, Trash2, Eye } from 'lucide-react';
import { LineUser } from '../../../types/line';
import { MessageLogs } from '@/components/admin/line/MessageLogs';
import { MessagePreview } from '@/components/admin/line/MessagePreview';

type MessageType = 'text' | 'image';

interface Message {
  type: MessageType;
  text?: string;
  imageUrl?: string;
}

interface MessageForm {
  messages: Message[];
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
  const [showPreview, setShowPreview] = useState(false);
  const { register, handleSubmit, watch, reset, control } = useForm<MessageForm>({
    defaultValues: {
      messages: [{ type: 'text' }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "messages"
  });
  const messages = watch('messages');

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

      if (data.messages.length === 0) {
        toast.error('メッセージを追加してください');
        return;
      }

      for (const message of data.messages) {
        if (message.type === 'text' && (!message.text || message.text.trim() === '')) {
          toast.error('テキストメッセージの内容を入力してください');
          return;
        }

        if (message.type === 'image' && (!message.imageUrl || !message.imageUrl.startsWith('https://'))) {
          toast.error('有効な画像URLを入力してください');
          return;
        }
      }

      // 送信データの準備
      const requestData = {
        messages: data.messages,
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
      reset({ messages: [{ type: 'text' }] });
      // 送信ログを更新
      if (typeof window !== 'undefined') {
        (window as any).refreshMessageLogs?.();
      }
    } catch (error) {
      toast.error('エラーが発生しました');
      console.error('Error:', error);
    }
  };

  const selectedUser = users.find(user => user.id === selectedUsers[0]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex gap-6">
          {/* メッセージ送信フォーム */}
          <div className="flex-1">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    メッセージ送信
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    プレビュー
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
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

                  {/* メッセージリスト */}
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 relative">
                        {/* メッセージタイプ選択 */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {messageTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <label
                                key={type.value}
                                className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                  messages[index]?.type === type.value
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  {...register(`messages.${index}.type`)}
                                  value={type.value}
                                  className="sr-only"
                                />
                                <Icon className={`w-8 h-8 mb-2 ${
                                  messages[index]?.type === type.value
                                    ? 'text-indigo-500'
                                    : 'text-gray-400'
                                }`} />
                                <span className={`text-sm font-medium ${
                                  messages[index]?.type === type.value
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

                        {/* メッセージ内容 */}
                        {messages[index]?.type === 'text' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-900">
                              メッセージ内容
                            </label>
                            <textarea
                              {...register(`messages.${index}.text`)}
                              rows={4}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="メッセージを入力してください"
                            />
                          </div>
                        )}

                        {messages[index]?.type === 'image' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-900">
                              画像URL
                            </label>
                            <input
                              type="url"
                              {...register(`messages.${index}.imageUrl`)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        )}

                        {/* 削除ボタン */}
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* メッセージ追加ボタン */}
                    <button
                      type="button"
                      onClick={() => append({ type: 'text' })}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-500 flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      メッセージを追加
                    </button>
                  </div>

                  {/* 送信ボタン */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      送信
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* プレビュー */}
          {showPreview && (
            <div className="w-[320px] flex-shrink-0">
              <MessagePreview
                messages={messages}
                userName={selectedUser?.displayName}
              />
            </div>
          )}
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
