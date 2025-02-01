'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Quest } from '@/types/quest';
import { QuestTable } from '@/components/admin/quests/QuestTable';
import { QuestFilters } from '@/components/admin/quests/QuestFilters';
import { fetchQuests, deleteQuest, updateQuestsOrder } from '@/lib/admin-api';
import { DeleteConfirmModal } from '@/components/admin/shared/DeleteConfirmModal';

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questToDelete, setQuestToDelete] = useState<Quest | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    type?: string[];
    platform?: string[];
    status?: string[];
  }>({});

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
      await loadQuests(); // リストを再読み込み
      setDeleteModalOpen(false);
      setQuestToDelete(null);
    } catch (err) {
      console.error('Error deleting quest:', err);
      // エラー処理を追加
    }
  };

  const handleReorder = async (reorderedQuests: Quest[]) => {
    try {
      // 新しい順序でクエストを更新
      const updates = reorderedQuests.map((quest, index) => ({
        id: quest.id,
        order_position: index,
      }));
      
      await updateQuestsOrder(updates);
      setQuests(reorderedQuests);
    } catch (err) {
      console.error('Error updating quest order:', err);
      // エラー処理を追加
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">クエスト管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            クエストの一覧、作成、編集、削除ができます。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/quests/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            クエストを作成
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <QuestFilters
          filters={filters}
          onChange={setFilters}
        />
      </div>

      <div className="mt-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">エラー</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <QuestTable
          quests={quests}
          loading={loading}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="クエストの削除"
        message="このクエストを削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  );
}
