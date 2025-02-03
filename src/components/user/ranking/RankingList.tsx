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

  // トップ3以外のランカー
  const otherRankings = rankings.slice(3);

  return (
    <div className="space-y-6 px-4">
      {otherRankings.map((ranking) => (
        <div
          key={ranking.id}
          className="transform rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 p-4 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full font-bold text-xl shadow-inner",
              "bg-gradient-to-br from-blue-400 to-indigo-500 text-white"
            )}>
              {ranking.rank}
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={ranking.avatar_url || '/default-avatar.png'}
                  alt={ranking.username}
                  className="h-14 w-14 rounded-full border-2 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow">
                  {ranking.level}
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <div className="font-bold text-gray-900">{ranking.username}</div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-indigo-600">{ranking.points.toLocaleString()} pt</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{ranking.quest_completed} クエスト完了</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
