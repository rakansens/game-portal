'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { UserRanking } from '@/types/ranking';
import { RankingForm } from '@/components/admin/ranking/RankingForm';
import { Button } from '@/components/user/ui/Button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// 仮のデータ（後でAPIから取得）
const mockRankings: UserRanking[] = [
  {
    id: 1,
    rank: 1,
    username: "ゲームマスター",
    points: 1500,
    avatar_url: "/avatars/1.png",
    level: 25,
    quest_completed: 42,
  },
  {
    id: 2,
    rank: 2,
    username: "クエストハンター",
    points: 1200,
    avatar_url: "/avatars/2.png",
    level: 20,
    quest_completed: 35,
  },
  {
    id: 3,
    rank: 3,
    username: "アドベンチャラー",
    points: 1000,
    avatar_url: "/avatars/3.png",
    level: 18,
    quest_completed: 30,
  },
];

export default function AdminRankingPage() {
  const [rankings, setRankings] = useState<UserRanking[]>(mockRankings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<UserRanking | undefined>();

  const handleEdit = (ranking: UserRanking) => {
    setSelectedRanking(ranking);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRanking(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('本当に削除しますか？')) {
      try {
        // TODO: API call to delete ranking
        setRankings(rankings.filter(r => r.id !== id));
        toast.success('ランキングを削除しました');
      } catch (error) {
        toast.error('削除に失敗しました');
      }
    }
  };

  const handleSubmit = async (data: UserRanking) => {
    try {
      if (selectedRanking) {
        // TODO: API call to update ranking
        setRankings(rankings.map(r => r.id === selectedRanking.id ? { ...data, id: r.id } : r));
        toast.success('ランキングを更新しました');
      } else {
        // TODO: API call to create ranking
        setRankings([...rankings, { ...data, id: Date.now() }]);
        toast.success('ランキングを作成しました');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('保存に失敗しました');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ランキング管理</h1>
        <Button onClick={handleCreate} variant="primary">新規作成</Button>
      </div>

      <div className="space-y-4">
        {rankings.map((ranking) => (
          <div
            key={ranking.id}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm
              hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative flex items-center gap-4 p-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold border-2",
                  ranking.rank === 1 && "bg-yellow-50 border-yellow-500 text-yellow-700",
                  ranking.rank === 2 && "bg-gray-50 border-gray-400 text-gray-700",
                  ranking.rank === 3 && "bg-orange-50 border-orange-500 text-orange-700",
                  ranking.rank > 3 && "bg-blue-50 border-admin-primary text-admin-primary"
                )}>
                  {ranking.rank}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{ranking.username}</h3>
                    <span className="rounded-full bg-admin-primary/10 px-2 py-0.5 text-sm text-admin-primary">
                      Lv.{ranking.level}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    完了クエスト: {ranking.quest_completed} | ポイント: {ranking.points}
                  </div>
                </div>

                <div className="flex gap-2">
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
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-gray-800/90 p-6 backdrop-blur-sm">
            <Dialog.Title className="text-xl font-bold text-white mb-6">
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
