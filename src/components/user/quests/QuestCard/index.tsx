'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Quest } from '@/types/quest';
import { Badge } from '@/components/shared/ui/Badge';
import { Button } from '@/components/user/ui/Button';
import { QuestDetailModal } from '@/components/user/quests/QuestModal/QuestDetailModal';
import { cn } from '@/lib/utils';

interface QuestCardProps {
  quest: Quest;
  onStart?: () => void;
  onComplete?: () => void;
}

export function QuestCard({ quest, onStart, onComplete }: QuestCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLimited = quest.is_limited || (quest.start_date && quest.end_date);

  return (
    <>
      <div 
        className="group relative w-full max-w-md animate-fade-in mx-auto p-4 bg-gray-800/90 rounded-xl cursor-pointer backdrop-blur-sm
          hover:bg-gray-700/90 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20
          active:scale-[0.98] active:translate-y-0 active:shadow-sm
          transition-all duration-300 ease-out"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{quest.title}</h3>
          <div className="flex gap-1.5">
            <Badge variant={quest.type === 'normal' ? 'default' : 'special'} size="sm">
              {quest.type === 'normal' ? 'ノーマル' : 'スペシャル'}
            </Badge>
            {isLimited && <Badge variant="limited" size="sm">期間限定</Badge>}
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-4 transition-colors duration-300 group-hover:text-gray-100">{quest.description}</p>

        {/* 期間情報 */}
        {isLimited && quest.start_date && quest.end_date && (
          <div className="mb-4 flex items-center rounded-2xl bg-[#2761c3]/10 px-3 py-2 text-sm text-[#27c39f] backdrop-blur-sm transition-all duration-300 group-hover:bg-[#2761c3]/20 group-hover:scale-[1.03] group-hover:shadow-inner">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {format(new Date(quest.start_date), 'M/d', { locale: ja })} 　{' '}
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
        <div className="flex justify-end gap-2">
          {onStart && (
            <Button
              onClick={onStart}
              variant="primary"
              size="lg"
              className="w-full transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110 active:scale-95"
            >
              クエストを開始
            </Button>
          )}
          {onComplete && (
            <Button
              onClick={onComplete}
              variant="success"
              size="lg"
              className="w-full transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110 active:scale-95"
            >
              クエストを完了
            </Button>
          )}
        </div>

        {/* 追加情報 */}
        {(quest.estimated_time || quest.max_attempts) && (
          <div className="border-t border-[#2761c3]/30 bg-[#2761c3]/5 px-4 py-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-[#2761c3]/10">
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
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine" style={{ animationDelay: '0.2s' }} />
        
        {/* グロー効果 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-current to-transparent opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20" />
      </div>

      {isModalOpen && (
        <QuestDetailModal
          quest={quest}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
