'use client';

import { Game } from '@/types/game';
import { Badge } from '@/components/shared/ui/Badge';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface GameCardProps {
  game: Game;
  featured?: boolean;
}

export function GameCard({ game, featured = false }: GameCardProps) {
  return (
    <motion.div
      className={cn(
        "group w-full animate-fade-in perspective",
        featured && "md:aspect-[16/9]"
      )}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg transition-all duration-500',
          'border-2 transform-gpu group-hover:scale-[1.02] group-hover:rotate-y-[-5deg]',
          'rounded-3xl',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-[#2761c3]/10 before:to-[#27c39f]/20 before:transition-opacity before:duration-500',
          'after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.2)_50%,transparent_75%,transparent_100%)] after:bg-[length:250%_250%] after:animate-shimmer',
          'group-hover:before:opacity-50',
          'border-[#2761c3] shadow-[0_0_15px_rgba(39,97,195,0.3)] group-hover:shadow-[0_0_25px_rgba(39,97,195,0.5)]',
          featured && 'md:h-full'
        )}
      >
        {/* サムネイル */}
        {game.thumbnail_url && (
          <div className={cn(
            "relative w-full overflow-hidden",
            featured ? "h-56 md:h-full" : "h-48 sm:h-56"
          )}>
            <img
              src={game.thumbnail_url}
              alt={game.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          </div>
        )}

        {/* ヘッダー部分 */}
        <div className={cn(
          "flex items-center justify-between border-b border-[#2761c3]/30 p-4 backdrop-blur-sm",
          featured && "absolute bottom-0 left-0 right-0 border-none bg-gradient-to-t from-gray-900/90 to-transparent"
        )}>
          <h3 className={cn(
            "text-lg font-bold text-[#ddebf0] text-shadow-neon transition-all duration-300 group-hover:text-shadow-neon-strong",
            featured && "text-xl md:text-2xl"
          )}>
            {game.title}
          </h3>
          <Badge variant="default" size="lg" className="bg-blue-100 text-blue-800">
            {game.category}
          </Badge>
        </div>

        {/* メインコンテンツ（通常カードのみ表示） */}
        {!featured && (
          <div className="p-4 backdrop-blur-sm">
            {/* 説明文 */}
            <p className="mb-6 text-sm text-[#ddebf0]/80 transition-colors duration-300 group-hover:text-[#ddebf0]">
              {game.description}
            </p>

            {/* アクションボタン */}
            <div className="flex justify-end">
              <motion.a
                href={game.play_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#2761c3] to-[#27c39f] px-8 py-3.5',
                  'text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300',
                  'hover:shadow-xl hover:shadow-blue-500/35 hover:scale-105 active:scale-95',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                プレイする
              </motion.a>
            </div>
          </div>
        )}

        {/* おすすめゲーム用のプレイボタン */}
        {featured && (
          <motion.a
            href={game.play_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'absolute right-4 top-4 inline-flex items-center justify-center rounded-xl',
              'bg-gradient-to-r from-[#2761c3] to-[#27c39f] px-8 py-3.5',
              'text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300',
              'hover:shadow-xl hover:shadow-blue-500/35 hover:scale-105 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            今すぐプレイ
          </motion.a>
        )}

        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine" style={{ animationDelay: '0.2s' }} />
        
        {/* グロー効果 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-current to-transparent opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20" />
      </div>
    </motion.div>
  );
} 