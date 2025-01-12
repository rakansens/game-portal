'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Quest } from '../../src/types/supabase';
import { fetchQuests } from '../../src/lib/api';

export default function AdminDashboard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        setLoading(true);
        const data = await fetchQuests();
        setQuests(data);
      } catch (err) {
        console.error('Error loading quests:', err);
        setError('クエストの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">クエスト管理</h1>
        <Link
          href="/admin/quests/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          新規クエスト作成
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                タイトル
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                タイプ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                報酬
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                期限
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {quests.map((quest) => (
              <tr key={quest.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{quest.title}</div>
                  <div className="text-sm text-gray-500">{quest.description}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    quest.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {quest.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {quest.type}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{quest.exp_reward} EXP</div>
                  {quest.points && quest.points > 0 && (
                    <div className="text-sm text-gray-500">{quest.points} Points</div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {quest.end_date ? new Date(quest.end_date).toLocaleDateString() : '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/quests/${quest.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}