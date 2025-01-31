'use client';

import { useState, useEffect } from 'react';
import { RankingList } from '@/components/user/ranking/RankingList';
import { RankingHeader } from '@/components/user/ranking/RankingHeader';
import { UserRanking } from '@/types/ranking';
import { BottomNav } from '@/components/shared/navigation/BottomNav';

// 仮のデータ（後でAPIから取得するように変更）
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
  // 他のユーザーデータ...
];

export default function RankingPage() {
  const [rankings, setRankings] = useState<UserRanking[]>(mockRankings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 後でAPIからデータを取得する実装に置き換え
  useEffect(() => {
    // TODO: Implement API fetch
  }, []);

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
    <div className="container mx-auto min-h-screen px-4 pb-20 pt-8">
      <RankingHeader />
      <RankingList rankings={rankings} />
      <BottomNav />
    </div>
  );
}
