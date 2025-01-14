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
    <div className="w-full max-w-md animate-fade-in mx-auto">
      <div
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg transition-all duration-300',
          'border-2 border-[#2761c3]',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-[#2761c3]/20',
          'after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:to-black/5',
          '-webkit-clip-path: polygon(92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%, 0 0)',
          'clip-path: polygon(92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%, 0 0)',
          isImportant && 'border-yellow-400 from-yellow-900/50 to-gray-800',
          isLimited && 'border-[#27c39f] from-[#27c39f]/20 to-gray-800'
        )}
      >
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between border-b border-[#2761c3]/30 p-4">
          <h3 className="text-lg font-bold text-[#ddebf0]">{quest.title}</h3>
          <div className="flex gap-1.5">
            <Badge variant={quest.type === 'normal' ? 'default' : 'special'} size="sm">
              {quest.type === 'normal' ? 'ノーマル' : 'スペシャル'}
            </Badge>
            {isLimited && <Badge variant="limited" size="sm">期間限定</Badge>}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="p-4">
          {/* 説明文 */}
          <p className="mb-4 text-sm text-[#ddebf0]/80 line-clamp-2">{quest.description}</p>

          {/* 報酬情報 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {quest.exp_reward > 0 && (
              <Badge variant="exp" size="lg" className="flex items-center gap-1 shadow-neon-exp">
                <span className="font-bold">{quest.exp_reward}</span>
                <span>EXP</span>
              </Badge>
            )}
            {quest.points && quest.points > 0 && (
              <Badge variant="points" size="lg" className="flex items-center gap-1 shadow-neon-points">
                <span className="font-bold">{quest.points}</span>
                <span>ポイント</span>
              </Badge>
            )}
          </div>

          {/* 期間情報 */}
          {isLimited && quest.start_date && quest.end_date && (
            <div className="mb-4 flex items-center rounded bg-[#2761c3]/10 px-3 py-2 text-sm text-[#27c39f]">
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
            <div className="mb-1.5 flex items-center justify-between text-sm text-[#ddebf0]/80">
              <span>進捗状況</span>
              <span className="font-medium">
                {quest.participant_count || 0}/{quest.participants_limit || '∞'}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2761c3]/20">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  quest.participant_count && quest.participants_limit && quest.participant_count >= quest.participants_limit
                    ? 'bg-gradient-to-r from-[#27c39f] to-[#2761c3]'
                    : 'bg-gradient-to-r from-[#2761c3] to-[#27c39f]'
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
                className="group relative w-full transform-gpu transition-all duration-300"
              >
                <span className="relative z-10 font-bold tracking-wider">クエストを開始</span>
                <div className="clip-corners absolute inset-0 bg-[#2761c3] transition-all duration-300 group-hover:bg-[#27c39f]" />
                <div className="clip-corners-sm absolute inset-0 bg-[#2761c3] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" />
              </Button>
            )}
            {onComplete && (
              <Button
                onClick={onComplete}
                variant="success"
                size="lg"
                className="group relative w-full transform-gpu transition-all duration-300"
              >
                <span className="relative z-10 font-bold tracking-wider">クエストを完了</span>
                <div className="clip-corners absolute inset-0 bg-[#27c39f] transition-all duration-300" />
                <div className="clip-corners-sm absolute inset-0 bg-[#27c39f] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" />
              </Button>
            )}
          </div>
        </div>

        {/* 追加情報 */}
        {(quest.estimated_time || quest.max_attempts) && (
          <div className="border-t border-[#2761c3]/30 bg-[#2761c3]/5 px-4 py-3">
            <div className="flex flex-wrap gap-4 text-sm text-[#ddebf0]/60">
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
      </div>
    </div>
  );
}
