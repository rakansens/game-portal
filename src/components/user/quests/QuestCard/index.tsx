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
          'relative overflow-hidden rounded-xl border-2 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]',
          isImportant ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white' : 'border-gray-100',
          isLimited && 'border-blue-400 bg-gradient-to-br from-blue-50 to-white'
        )}
      >
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold text-gray-900">{quest.title}</h3>
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
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{quest.description}</p>

          {/* 報酬情報 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {quest.exp_reward > 0 && (
              <Badge variant="exp" size="lg" className="flex items-center gap-1 shadow-sm">
                <span className="font-bold">{quest.exp_reward}</span>
                <span>EXP</span>
              </Badge>
            )}
            {quest.points && quest.points > 0 && (
              <Badge variant="points" size="lg" className="flex items-center gap-1 shadow-sm">
                <span className="font-bold">{quest.points}</span>
                <span>ポイント</span>
              </Badge>
            )}
          </div>

          {/* 期間情報 */}
          {isLimited && quest.start_date && quest.end_date && (
            <div className="mb-4 flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
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
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
              <span>進捗状況</span>
              <span className="font-medium">
                {quest.participant_count || 0}/{quest.participants_limit || '∞'}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  quest.participant_count && quest.participants_limit && quest.participant_count >= quest.participants_limit
                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
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
                className="w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                クエストを開始
              </Button>
            )}
            {onComplete && (
              <Button
                onClick={onComplete}
                variant="success"
                size="lg"
                className="w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                クエストを完了
              </Button>
            )}
          </div>
        </div>

        {/* 追加情報 */}
        {(quest.estimated_time || quest.max_attempts) && (
          <div className="border-t bg-gradient-to-b from-gray-50 to-white px-4 py-3">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
