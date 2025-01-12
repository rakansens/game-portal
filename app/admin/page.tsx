'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Quest } from '../../src/types/supabase';
import { QuestFilters } from '../../src/types/quest';
import { fetchQuests } from '../../src/lib/api';
import { QuestTable } from '../../src/components/admin/QuestTable';
import { QuestFilterBar } from '../../src/components/admin/QuestFilterBar';

export default function AdminDashboard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QuestFilters>({
    search: '',
    type: 'all',
    status: 'all'
  });

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
    const matchesSearch = filters.search === '' || 
      quest.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      quest.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = filters.type === 'all' || quest.type === filters.type;
    const matchesStatus = filters.status === 'all' || quest.status === filters.status;

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
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">クエスト管理</h1>
          <p className="mt-1 text-sm text-gray-600">クエストの作成、編集、削除を行えます。</p>
        </div>
        <div>
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

      <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <QuestFilterBar
          filters={filters}
          onChange={setFilters}
        />
        <QuestTable
          quests={filteredQuests}
          onDelete={(id) => {
            // TODO: 削除確認モーダルの実装
            console.log('Delete quest:', id);
          }}
        />
      </div>
    </div>
  );
}