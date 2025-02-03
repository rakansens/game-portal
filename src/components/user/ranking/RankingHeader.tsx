'use client';

import { useState, useEffect } from 'react';
import { UserRanking } from '@/types/ranking';
import { cn } from '@/lib/utils';

export function RankingHeader() {
  const [topRankings, setTopRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('/api/ranking');
        if (!response.ok) {
          throw new Error('ランキングの取得に失敗しました');
        }
        const data = await response.json();
        setTopRankings(data.slice(0, 3));
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

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-600 p-6 text-white">
      <h1 className="mb-6 text-center text-2xl font-bold">ランキング</h1>
      <div className="flex justify-center space-x-4">
        {topRankings.map((ranking, index) => (
          <div
            key={ranking.id}
            className={cn(
              "flex flex-col items-center space-y-2",
              index === 1 && "-mt-4"
            )}
          >
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full font-bold text-xl",
              index === 0 && "bg-yellow-400 text-yellow-800",
              index === 1 && "bg-gray-200 text-gray-800",
              index === 2 && "bg-amber-600 text-amber-100"
            )}>
              {ranking.rank}
            </div>
            <div className="relative">
              <img
                src={ranking.avatar_url || '/default-avatar.png'}
                alt={ranking.username}
                className={cn(
                  "rounded-full border-4 border-white",
                  index === 1 && "h-24 w-24",
                  (index === 0 || index === 2) && "h-20 w-20"
                )}
              />
            </div>
            <div className="text-center">
              <div className="font-medium">{ranking.username}</div>
              <div className="text-sm opacity-90">
                Lv.{ranking.level} • {ranking.points.toLocaleString()}pt
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
