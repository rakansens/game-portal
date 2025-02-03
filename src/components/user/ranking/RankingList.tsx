'use client';

import { useState, useEffect } from 'react';
import { UserRanking } from '@/types/ranking';
import { cn } from '@/lib/utils';

export function RankingList() {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('/api/ranking');
        if (!response.ok) {
          throw new Error('ランキングの取得に失敗しました');
        }
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">ランキングデータがありません</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rankings.map((ranking) => (
        <div
          key={ranking.id}
          className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg",
            ranking.rank === 1 && "bg-yellow-100 text-yellow-800",
            ranking.rank === 2 && "bg-gray-100 text-gray-800",
            ranking.rank === 3 && "bg-amber-100 text-amber-800",
            ranking.rank > 3 && "bg-blue-100 text-blue-800"
          )}>
            {ranking.rank}
          </div>
          <div className="flex-shrink-0">
            <img
              src={ranking.avatar_url || '/default-avatar.png'}
              alt={ranking.username}
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div className="flex-grow">
            <div className="font-medium">{ranking.username}</div>
            <div className="text-sm text-gray-500">
              Lv.{ranking.level} • {ranking.points.toLocaleString()}ポイント • {ranking.quest_completed}クエスト完了
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
