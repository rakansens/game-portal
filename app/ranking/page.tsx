'use client';

import { RankingList } from '@/components/user/ranking/RankingList';
import { BottomNav } from '@/components/shared/navigation/BottomNav';

export default function RankingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <main className="flex-1">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => window.history.back()}
            className="text-white"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-white">ランキング</h1>
          <div className="w-4"></div>
        </div>
        <RankingList />
      </main>
      <BottomNav />
    </div>
  );
}
