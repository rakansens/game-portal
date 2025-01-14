'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Quest } from '@/types/quest';
import { QuestTable } from '@/components/admin/QuestTable';
import { QuestFilters } from '@/components/admin/QuestFilters';
import { fetchQuests, deleteQuest, updateQuestsOrder } from '@/lib/admin-api';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';

export default function AdminPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questToDelete, setQuestToDelete] = useState<Quest | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const data = await fetchQuests();
      // order_positionでソート
      const sortedData = [...data].sort((a, b) => 
        (a.order_position ?? 0) - (b.order_position ?? 0)
      );
      setQuests(sortedData);
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

  const handleDelete = async (quest: Quest) => {
    setQuestToDelete(quest);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questToDelete) return;

    try {
      await deleteQuest(questToDelete.id);
      await loadQuests(); // クエスト一覧を再読み込み
      setDeleteModalOpen(false);
      setQuestToDelete(null);
    } catch (err) {
      console.error('Error deleting quest:', err);
      alert('クエストの削除に失敗しました');
    }
  };

  const handleOrderChange = async (updatedQuests: Quest[]) => {
    try {
      await updateQuestsOrder(updatedQuests);
      setQuests(updatedQuests);
    } catch (err) {
      console.error('Error updating quests order:', err);
      alert('クエストの並び順の更新に失敗しました');
      // エラーが発生した場合は元の順序に戻す
      await loadQuests();
    }
  };

  // フィルタリングされたクエストを取得
  const filteredQuests = quests.filter(quest => {
    const typeMatch = selectedTypes.length === 0 || (quest.type && selectedTypes.includes(quest.type));
    const platformMatch = selectedPlatforms.length === 0 || (quest.platform && selectedPlatforms.includes(quest.platform));
    const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(quest.status);
    return typeMatch && platformMatch && statusMatch;
  });

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
          selectedTypes={selectedTypes}
          selectedPlatforms={selectedPlatforms}
          selectedStatuses={selectedStatuses}
          onTypeChange={setSelectedTypes}
          onPlatformChange={setSelectedPlatforms}
          onStatusChange={setSelectedStatuses}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow">
        <QuestTable
          quests={filteredQuests}
          onDelete={handleDelete}
          onOrderChange={handleOrderChange}
        />
      </div>

      {questToDelete && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setQuestToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title={questToDelete.title}
        />
      )}
    </div>
  );
}