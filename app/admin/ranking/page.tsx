'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { UserRanking, RankingFormData } from '@/types/ranking';
import { RankingForm } from '@/components/admin/ranking/RankingForm';
import { Button } from '@/components/admin/ui/Button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminRankingPage() {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<UserRanking | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/admin/rankings');
      if (!response.ok) {
        throw new Error('ランキングの取得に失敗しました');
      }
      const data = await response.json();
      setRankings(data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      toast.error('ランキングの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const handleEdit = (ranking: UserRanking) => {
    setSelectedRanking(ranking);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('本当に削除しますか?')) {
      try {
        const response = await fetch(`/api/admin/rankings?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('削除に失敗しました');
        }
        await fetchRankings();
        toast.success('ランキングを削除しました');
      } catch (error) {
        console.error('Error deleting ranking:', error);
        toast.error('削除に失敗しました');
      }
    }
  };

  const handleSubmit = async (data: RankingFormData) => {
    try {
      const response = await fetch('/api/admin/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: data.user_id,
          points: data.points,
        }),
      });

      if (!response.ok) {
        throw new Error('保存に失敗しました');
      }

      await fetchRankings();
      setIsModalOpen(false);
      toast.success(selectedRanking ? 'ランキングを更新しました' : 'ランキングを作成しました');
    } catch (error) {
      console.error('Error saving ranking:', error);
      toast.error('保存に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white p-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ランキング管理</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">レベル</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ポイント</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">クエスト完了数</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((ranking) => (
                <tr key={ranking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-full font-semibold",
                      ranking.rank === 1 && "bg-yellow-100 text-yellow-800",
                      ranking.rank === 2 && "bg-gray-100 text-gray-800",
                      ranking.rank === 3 && "bg-amber-100 text-amber-800",
                      ranking.rank > 3 && "bg-blue-100 text-blue-800"
                    )}>
                      {ranking.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={ranking.avatar_url || '/default-avatar.png'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{ranking.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Lv.{ranking.level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ranking.points.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ranking.quest_completed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleEdit(ranking)}
                        variant="secondary"
                        size="sm"
                      >
                        編集
                      </Button>
                      <Button
                        onClick={() => handleDelete(ranking.id)}
                        variant="danger"
                        size="sm"
                      >
                        削除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-6">
              {selectedRanking ? 'ランキングを編集' : 'ランキングを作成'}
            </Dialog.Title>

            <RankingForm
              initialData={selectedRanking}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
