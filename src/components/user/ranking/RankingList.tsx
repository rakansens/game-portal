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
          className="group relative w-full animate-fade-in rounded-xl backdrop-blur-sm
            hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg
            active:scale-[0.98] active:translate-y-0 active:shadow-sm
            transition-all duration-300 ease-out"
        >
          <div className={cn(
            "relative overflow-hidden rounded-xl p-[1px]",
            user.rank === 1 && "bg-gradient-to-r from-yellow-400/80 via-yellow-500/80 to-yellow-600/80",
            user.rank === 2 && "bg-gradient-to-r from-gray-300/80 via-gray-400/80 to-gray-500/80",
            user.rank === 3 && "bg-gradient-to-r from-amber-700/80 via-amber-800/80 to-amber-900/80",
            user.rank > 3 && "bg-gradient-to-r from-[#2761c3]/80 via-[#27c39f]/80 to-[#2761c3]/80"
          )}>
            <div className="relative flex items-center gap-4 rounded-xl bg-gray-800/90 p-4 backdrop-blur-sm">
              {/* ランク表示 */}
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ring-2 ring-white/20 shadow-lg transition-all duration-300",
                user.rank === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black group-hover:shadow-yellow-500/30",
                user.rank === 2 && "bg-gradient-to-br from-gray-300 to-gray-500 text-black group-hover:shadow-gray-400/30",
                user.rank === 3 && "bg-gradient-to-br from-amber-700 to-amber-900 text-white group-hover:shadow-amber-800/30",
                user.rank > 3 && "bg-gradient-to-br from-[#2761c3] to-[#27c39f] text-white group-hover:shadow-blue-500/30"
              )}>
                {user.rank}
              </div>

              {/* アバター */}
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/20 transition-all duration-300 group-hover:ring-white/30">
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  width={48}
                  height={48}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* ユーザー情報 */}
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white transition-colors duration-300 group-hover:text-white/90">{user.username}</h3>
                  <span className="rounded bg-[#2761c3]/20 px-2 py-0.5 text-sm text-[#27c39f] backdrop-blur-sm transition-all duration-300 group-hover:bg-[#2761c3]/30">
                    Lv.{user.level}
                  </span>
                </div>
                <div className="mt-1 text-sm text-[#ddebf0]/60 transition-colors duration-300 group-hover:text-[#ddebf0]/80">
                  完了クエスト: {user.quest_completed}
                </div>
              </div>

              {/* ポイント */}
              <div className="text-right">
                <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105 group-hover:text-[#27c39f]">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-sm text-[#ddebf0]/60 transition-colors duration-300 group-hover:text-[#ddebf0]/80">ポイント</div>
              </div>

              {/* 装飾的な背景エフェクト */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
