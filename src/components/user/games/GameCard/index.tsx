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
  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: '0 10px 30px -15px rgba(39, 97, 195, 0.3)',
      background: 'linear-gradient(to right, #2761c3, #27c39f)'
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 20px 40px -20px rgba(39, 97, 195, 0.5)',
      background: 'linear-gradient(to right, #3172d4, #32d4ae)',
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10,
        background: {
          duration: 0.3
        }
      }
    },
    tap: { 
      scale: 0.95,
      boxShadow: '0 5px 15px -10px rgba(39, 97, 195, 0.4)',
      background: 'linear-gradient(to right, #1f50a0, #1ea88a)',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        background: {
          duration: 0.1
        }
      }
    }
  };

  const buttonClasses = cn(
    'relative inline-flex items-center justify-center rounded-xl overflow-hidden',
    'px-8 py-3.5 text-base font-semibold text-white transition-all duration-300',
    'before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] before:opacity-0 before:transition-opacity',
    'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900'
  );

  const playIconVariants = {
    initial: { x: -5, opacity: 0 },
    hover: { 
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

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
                className={buttonClasses}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <motion.span
                  className="absolute left-4 text-xl"
                  variants={playIconVariants}
                >
                  ▶
                </motion.span>
                <span className="relative z-10">プレイする</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{ 
                    scale: 4,
                    opacity: 0.3,
                    transition: { duration: 0.5 }
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20"
                  initial={{ opacity: 0, rotate: -45 }}
                  whileHover={{ 
                    opacity: 1,
                    rotate: 0,
                    transition: { duration: 0.3 }
                  }}
                />
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
            className={cn(buttonClasses, 'absolute right-4 top-4')}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <motion.span
              className="absolute left-4 text-xl"
              variants={playIconVariants}
            >
              ▶
            </motion.span>
            <span className="relative z-10">今すぐプレイ</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ 
                scale: 4,
                opacity: 0.3,
                transition: { duration: 0.5 }
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20"
              initial={{ opacity: 0, rotate: -45 }}
              whileHover={{ 
                opacity: 1,
                rotate: 0,
                transition: { duration: 0.3 }
              }}
            />
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