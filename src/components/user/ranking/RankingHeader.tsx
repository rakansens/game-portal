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
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-500 to-blue-600 pb-12 pt-8">
      {/* 装飾的な背景要素 */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-yellow-400 opacity-20 blur-3xl"></div>
      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
      
      <h1 className="relative mb-12 text-center text-3xl font-bold text-white">ランキング</h1>
      
      <div className="relative mx-auto flex max-w-2xl justify-center px-4">
        {topRankings.map((ranking, index) => {
          const isSecond = index === 1;
          const isFirst = index === 0;
          const isThird = index === 2;
          
          return (
            <div
              key={ranking.id}
              className={cn(
                "flex flex-col items-center px-2",
                isSecond && "order-1 -mt-4",
                isFirst && "order-2 mt-8",
                isThird && "order-3 mt-12"
              )}
            >
              <div className={cn(
                "mb-2 flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold shadow-lg",
                isFirst && "bg-yellow-400 text-yellow-900",
                isSecond && "bg-gray-200 text-gray-800",
                isThird && "bg-amber-600 text-amber-100"
              )}>
                {ranking.rank}
              </div>
              
              <div className="relative">
                <div className={cn(
                  "relative overflow-hidden rounded-full border-4 shadow-xl",
                  isFirst && "border-yellow-400",
                  isSecond && "border-gray-200",
                  isThird && "border-amber-600",
                  isSecond ? "h-24 w-24" : "h-20 w-20"
                )}>
                  <img
                    src={ranking.avatar_url || '/default-avatar.png'}
                    alt={ranking.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow",
                  isFirst && "bg-yellow-500",
                  isSecond && "bg-gray-600",
                  isThird && "bg-amber-700"
                )}>
                  {ranking.level}
                </div>
              </div>
              
              <div className="mt-2 text-center">
                <div className="font-bold text-white">{ranking.username}</div>
                <div className="text-sm text-blue-100">
                  {ranking.points.toLocaleString()} pt
                </div>
                <div className="text-xs text-blue-200">
                  {ranking.quest_completed} クエスト
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
