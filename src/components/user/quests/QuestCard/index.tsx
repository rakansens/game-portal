'use client';

import { Quest } from '@/types/quest';
import { Badge } from '@/components/shared/ui/Badge';
import { Button } from '@/components/shared/ui/Button';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface QuestCardProps {
  quest: Quest;
  onStart?: () => void;
  onComplete?: () => void;
}

export function QuestCard({ quest, onStart, onComplete }: QuestCardProps) {
  const isLimited = quest.is_limited || (quest.start_date && quest.end_date);
  const isImportant = quest.is_important;

  return (
    <div className="group w-full max-w-md animate-fade-in mx-auto perspective">
      <div
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg transition-all duration-500',
          'border-2 transform-gpu group-hover:scale-[1.02] group-hover:rotate-y-[-5deg]',
          'clip-corners',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-[#2761c3]/10 before:to-[#27c39f]/20',
          'after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.2)_50%,transparent_75%,transparent_100%)] after:bg-[length:250%_250%] after:animate-shimmer',
          isImportant && 'border-yellow-400 before:via-yellow-500/10 before:to-yellow-600/20 shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]',
          isLimited && 'border-[#27c39f] before:via-[#27c39f]/10 before:to-[#2761c3]/20 shadow-[0_0_15px_rgba(45,192,156,0.3)] group-hover:shadow-[0_0_25px_rgba(45,192,156,0.5)]',
          !isImportant && !isLimited && 'border-[#2761c3] shadow-[0_0_15px_rgba(39,97,195,0.3)] group-hover:shadow-[0_0_25px_rgba(39,97,195,0.5)]'
        )}
      >
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between border-b border-[#2761c3]/30 p-4 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-[#ddebf0] text-shadow-neon group-hover:text-shadow-neon-strong">{quest.title}</h3>
          <div className="flex gap-1.5">
            <Badge variant={quest.type === 'normal' ? 'default' : 'special'} size="sm">
              {quest.type === 'normal' ? 'ノーマル' : 'スペシャル'}
            </Badge>
            {isLimited && <Badge variant="limited" size="sm">期間限定</Badge>}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="p-4 backdrop-blur-sm">
          {/* 説明文 */}
          <p className="mb-4 text-sm text-[#ddebf0]/80 transition-colors duration-300 group-hover:text-[#ddebf0]">{quest.description}</p>

          {/* 報酬情報 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {quest.exp_reward > 0 && (
              <Badge variant="exp" size="lg" className="flex items-center gap-1 shadow-neon-exp animate-pulse-slow group-hover:animate-none group-hover:scale-110 transition-transform duration-300">
                <span className="font-bold">{quest.exp_reward}</span>
                <span>EXP</span>
              </Badge>
            )}
            {quest.points && quest.points > 0 && (
              <Badge variant="points" size="lg" className="flex items-center gap-1 shadow-neon-points animate-pulse-slow group-hover:animate-none group-hover:scale-110 transition-transform duration-300">
                <span className="font-bold">{quest.points}</span>
                <span>ポイント</span>
              </Badge>
            )}
          </div>

          {/* 期間情報 */}
          {isLimited && quest.start_date && quest.end_date && (
            <div className="mb-4 flex items-center rounded-lg bg-[#2761c3]/10 px-3 py-2 text-sm text-[#27c39f] backdrop-blur-sm transition-colors duration-300 group-hover:bg-[#2761c3]/20">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {format(new Date(quest.start_date), 'M/d', { locale: ja })} 〜{' '}
                {format(new Date(quest.end_date), 'M/d', { locale: ja })}
              </span>
            </div>
          )}

          {/* 進捗情報 */}
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between text-sm text-[#ddebf0]/80 transition-colors duration-300 group-hover:text-[#ddebf0]">
              <span>進捗状況</span>
              <span className="font-medium">
                {quest.participant_count || 0}/{quest.participants_limit || '∞'}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#2761c3]/20 backdrop-blur-sm">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  quest.participant_count && quest.participants_limit && quest.participant_count >= quest.participants_limit
                    ? 'bg-gradient-to-r from-[#27c39f] to-[#2761c3] shadow-neon-progress group-hover:shadow-neon-progress-strong'
                    : 'bg-gradient-to-r from-[#2761c3] to-[#27c39f] shadow-neon-progress group-hover:shadow-neon-progress-strong'
                )}
                style={{
                  width: `${
                    quest.participants_limit
                      ? (quest.participant_count || 0) / quest.participants_limit * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end">
            {onStart && (
              <Button
                onClick={onStart}
                variant="primary"
                size="lg"
                className="w-full transform-gpu transition-all duration-300 group-hover:scale-105"
              >
                クエストを開始
              </Button>
            )}
            {onComplete && (
              <Button
                onClick={onComplete}
                variant="success"
                size="lg"
                className="w-full transform-gpu transition-all duration-300 group-hover:scale-105"
              >
                クエストを完了
              </Button>
            )}
          </div>
        </div>

        {/* 追加情報 */}
        {(quest.estimated_time || quest.max_attempts) && (
          <div className="border-t border-[#2761c3]/30 bg-[#2761c3]/5 px-4 py-3 backdrop-blur-sm">
            <div className="flex flex-wrap gap-4 text-sm text-[#ddebf0]/60 transition-colors duration-300 group-hover:text-[#ddebf0]/80">
              {quest.estimated_time && (
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{quest.estimated_time}分</span>
                </span>
              )}
              {quest.max_attempts && (
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>最大{quest.max_attempts}回</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* 装飾的な要素 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine" />
        <div className="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 bg-current opacity-0 transition-all group-hover:opacity-100" />
        <div className="absolute -right-2 top-1/2 h-2 w-2 -translate-y-1/2 bg-current opacity-0 transition-all group-hover:opacity-100" />
      </div>
    </div>
  );
}
