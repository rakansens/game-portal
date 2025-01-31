'use client';

import Image from 'next/image';
import { UserRanking } from '@/types/ranking';
import { cn } from '@/utils/cn';

interface RankingListProps {
  rankings: UserRanking[];
}

export function RankingList({ rankings }: RankingListProps) {
  return (
    <div className="space-y-4">
      {rankings.map((user) => (
        <div
          key={user.id}
          className={cn(
            "relative overflow-hidden rounded-2xl bg-gradient-to-r p-[2px] transition-transform hover:scale-[1.02]",
            user.rank === 1 && "from-yellow-400 via-yellow-500 to-yellow-600",
            user.rank === 2 && "from-gray-300 via-gray-400 to-gray-500",
            user.rank === 3 && "from-amber-700 via-amber-800 to-amber-900",
            user.rank > 3 && "from-blue-600 via-blue-700 to-blue-800"
          )}
        >
          <div className="relative flex items-center gap-4 rounded-2xl bg-gray-900 p-4">
            {/* ランク表示 */}
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold",
              user.rank === 1 && "bg-yellow-500 text-black",
              user.rank === 2 && "bg-gray-400 text-black",
              user.rank === 3 && "bg-amber-800 text-white",
              user.rank > 3 && "bg-blue-700 text-white"
            )}>
              {user.rank}
            </div>

            {/* アバター */}
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
              <Image
                src={user.avatar_url}
                alt={user.username}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>

            {/* ユーザー情報 */}
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">{user.username}</h3>
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-sm text-blue-400">
                  Lv.{user.level}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-400">
                完了クエスト: {user.quest_completed}
              </div>
            </div>

            {/* ポイント */}
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {user.points.toLocaleString()}
              </div>
              <div className="text-sm text-blue-400">ポイント</div>
            </div>

            {/* 装飾的な背景エフェクト */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine" />
          </div>
        </div>
      ))}
    </div>
  );
}
