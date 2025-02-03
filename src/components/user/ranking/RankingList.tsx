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

  // トップ3のランカー
  const topRankers = rankings.slice(0, 3);
  // 4位以降のランカー
  const otherRankers = rankings.slice(3);

  return (
    <div className="space-y-8 px-4 py-6">
      {/* トップ3のカード表示 */}
      <div className="flex justify-center space-x-4">
        {topRankers.map((ranking, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;
          
          return (
            <div
              key={ranking.id}
              className={cn(
                "relative w-[30%] rounded-xl p-4 text-center",
                isSecond && "bg-gray-100 mt-8",
                isFirst && "bg-blue-100 -mt-4",
                isThird && "bg-pink-100 mt-12"
              )}
            >
              {isFirst && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="text-2xl">👑</span>
                </div>
              )}
              <div className={cn(
                "absolute -top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold",
                isFirst && "bg-yellow-400 text-yellow-900",
                isSecond && "bg-gray-400 text-white",
                isThird && "bg-amber-600 text-white"
              )}>
                {ranking.rank}
              </div>
              <div className="mb-2">
                <img
                  src={ranking.avatar_url || '/default-avatar.png'}
                  alt={ranking.username}
                  className="mx-auto h-16 w-16 rounded-full"
                />
              </div>
              <div className="font-bold text-gray-900">{ranking.username}</div>
              <div className="mt-1 text-sm font-medium text-rose-500">
                +{ranking.points.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {ranking.quest_completed}クエスト
              </div>
            </div>
          );
        })}
      </div>

      {/* 4位以降のリスト表示 */}
      <div className="space-y-4">
        {otherRankers.map((ranking) => (
          <div
            key={ranking.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700">
                {ranking.rank}
              </div>
              <img
                src={ranking.avatar_url || '/default-avatar.png'}
                alt={ranking.username}
                className="h-10 w-10 rounded-full"
              />
              <div className="font-medium text-gray-900">{ranking.username}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-rose-500">
                +{ranking.points.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {ranking.quest_completed}クエスト
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
