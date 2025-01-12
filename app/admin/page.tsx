'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Quest } from '../../src/types/supabase';
import { fetchQuests } from '../../src/lib/api';

export default function AdminDashboard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredQuests = quests.filter(quest => {
    const matchesSearch = search === '' || 
      quest.title.toLowerCase().includes(search.toLowerCase()) ||
      quest.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'all' || quest.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || quest.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
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
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">クエスト管理</h1>
          <p className="mt-2 text-sm text-gray-600">クエストの作成、編集、削除を行えます。</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/quests/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規クエスト作成
          </Link>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:flex sm:items-center sm:justify-between">
          <div className="flex-1 sm:flex sm:items-center">
            <div className="max-w-xs">
              <label htmlFor="search" className="sr-only">
                検索
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="クエストを検索..."
                />
              </div>
            </div>
            <div className="mt-3 sm:ml-4 sm:mt-0">
              <div className="flex space-x-4">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">すべてのタイプ</option>
                  <option value="normal">通常</option>
                  <option value="limited_time">期間限定</option>
                  <option value="roulette">ルーレット</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="active">アクティブ</option>
                  <option value="draft">下書き</option>
                  <option value="archived">アーカイブ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {filteredQuests.map((quest) => (
                <tr key={quest.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{quest.title}</div>
                    <div className="text-sm text-gray-500">{quest.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      quest.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : quest.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quest.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      quest.type === 'limited_time'
                        ? 'bg-purple-100 text-purple-800'
                        : quest.type === 'roulette'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quest.type}
                    </span>
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
                    <button
                      onClick={() => {/* TODO: 削除確認モーダル */}}
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
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