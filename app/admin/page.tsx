'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Quest } from '../../src/types/supabase';
import { QuestTable } from '../../src/components/admin/QuestTable';
import { QuestFilters } from '../../src/components/admin/QuestFilters';
import { fetchQuests, deleteQuest } from '../../src/lib/admin-api';

export default function AdminPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const data = await fetchQuests();
      setQuests(data);
    } catch (err) {
      setError('クエストの読み込みに失敗しました');
      console.error('Error loading quests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuests();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuest(id);
      // 削除成功後、クエスト一覧を再読み込み
      await loadQuests();
    } catch (err) {
      console.error('Error deleting quest:', err);
      alert('クエストの削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">クエスト管理</h1>
        <Link
          href="/admin/quests/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>

      <div className="mb-6">
        <QuestFilters
          quests={quests}
          onFilterChange={(filters) => {
            // TODO: フィルター機能の実装
            console.log('Filters:', filters);
          }}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow">
        <QuestTable quests={quests} onDelete={handleDelete} />
      </div>
    </div>
  );
}