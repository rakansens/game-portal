'use client';

import { useState } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { LineUser, QuestProgress } from '@/types/line';



// モックデータ
const mockUsers: LineUser[] = [
  {
    id: 'U1234567890abcdef1',
    displayName: '山田太郎',
    pictureUrl: 'https://profile.line-scdn.net/sample1.jpg',
    statusMessage: '今日も一日がんばるぞい！',
    email: 'taro.yamada@example.com',
    isBlocked: false,
    registeredAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-01-31T08:15:00Z',
    totalPoints: 2500,
    completedQuests: [
      {
        questId: 1,
        questName: '初心者チュートリアル',
        points: 500,
        completedAt: '2024-01-16T10:30:00Z',
      },
      {
        questId: 2,
        questName: '宝探しミッション',
        points: 1000,
        completedAt: '2024-01-20T15:45:00Z',
      },
    ],
    currentQuests: [
      {
        questId: 3,
        questName: '伝説の剣を探せ',
        points: 2000,
        completedAt: '',
      },
    ],
  },
  {
    id: 'U1234567890abcdef2',
    displayName: '佐藤花子',
    pictureUrl: 'https://profile.line-scdn.net/sample2.jpg',
    isBlocked: true,
    registeredAt: '2024-01-10T15:45:00Z',
    lastLoginAt: '2024-01-20T12:00:00Z',
    totalPoints: 500,
    completedQuests: [
      {
        questId: 1,
        questName: '初心者チュートリアル',
        points: 500,
        completedAt: '2024-01-11T10:30:00Z',
      },
    ],
    currentQuests: [],
  },
  {
    id: 'U1234567890abcdef3',
    displayName: '田中一郎',
    pictureUrl: 'https://profile.line-scdn.net/sample3.jpg',
    statusMessage: 'ゲーム大好き！',
    isBlocked: false,
    registeredAt: '2024-01-05T09:20:00Z',
    lastLoginAt: '2024-01-30T22:45:00Z',
    totalPoints: 1500,
    completedQuests: [
      {
        questId: 1,
        questName: '初心者チュートリアル',
        points: 500,
        completedAt: '2024-01-06T10:30:00Z',
      },
      {
        questId: 2,
        questName: '宝探しミッション',
        points: 1000,
        completedAt: '2024-01-25T15:45:00Z',
      },
    ],
    currentQuests: [
      {
        questId: 4,
        questName: '魔法の書を集めよう',
        points: 1500,
        completedAt: '',
      },
    ],
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<LineUser[]>(mockUsers);

  const handleBlock = async (userId: string) => {
    try {
      // TODO: API call to block/unblock user
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
      ));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="mt-1 text-sm text-gray-500">LINEユーザーの管理と状態の確認ができます</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            総ユーザー数: <span className="font-semibold text-gray-900">{users.length}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">獲得ポイント</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">クエスト進捗</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登録日時</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終ログイン</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={user.pictureUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                          {user.email && (
                            <Badge variant="secondary" className="text-xs">
                              Email連携済
                            </Badge>
                          )}
                        </div>
                        {user.statusMessage && (
                          <div className="text-sm text-gray-500">{user.statusMessage}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={user.isBlocked ? 'danger' : 'success'}
                      className="text-xs"
                    >
                      {user.isBlocked ? 'ブロック中' : 'アクティブ'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.totalPoints.toLocaleString()} pt</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="text-xs">
                          完了: {user.completedQuests.length}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          進行中: {user.currentQuests.length}
                        </Badge>
                      </div>
                      {user.currentQuests.length > 0 && (
                        <div className="text-xs text-gray-500">
                          現在のクエスト: {user.currentQuests[0].questName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.registeredAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLoginAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleBlock(user.id)}
                        variant={user.isBlocked ? 'secondary' : 'danger'}
                        size="sm"
                      >
                        {user.isBlocked ? 'ブロック解除' : 'ブロック'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
