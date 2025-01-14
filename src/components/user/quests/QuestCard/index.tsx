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
    <div className="w-full animate-fade-in">
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md',
          isImportant && 'border-yellow-400 bg-yellow-50',
          isLimited && 'border-blue-400'
        )}
      >
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="text-base font-bold text-gray-900">{quest.title}</h3>
          <div className="flex gap-1">
            <Badge variant={quest.type === 'normal' ? 'default' : 'special'} size="sm">
              {quest.type === 'normal' ? 'ノーマル' : 'スペシャル'}
            </Badge>
            {isLimited && <Badge variant="limited" size="sm">期間限定</Badge>}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="p-3">
          {/* 説明文 */}
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">{quest.description}</p>

          {/* 報酬情報 */}
          <div className="mb-3 flex flex-wrap gap-2">
            {quest.exp_reward > 0 && (
              <Badge variant="exp" size="sm" className="flex items-center gap-1">
                <span className="font-bold">{quest.exp_reward}</span>
                <span>EXP</span>
              </Badge>
            )}
            {quest.points && quest.points > 0 && (
              <Badge variant="points" size="sm" className="flex items-center gap-1">
                <span className="font-bold">{quest.points}</span>
                <span>ポイント</span>
              </Badge>
            )}
          </div>

          {/* 期間情報 */}
          {isLimited && quest.start_date && quest.end_date && (
            <div className="mb-3 flex items-center text-xs text-blue-700">
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {format(new Date(quest.start_date), 'M/d', { locale: ja })} 〜{' '}
                {format(new Date(quest.end_date), 'M/d', { locale: ja })}
              </span>
            </div>
          )}

          {/* 進捗情報 */}
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
              <span>進捗状況</span>
              <span className="font-medium">
                {quest.participant_count || 0}/{quest.participants_limit || '∞'}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  quest.participant_count && quest.participants_limit && quest.participant_count >= quest.participants_limit
                    ? 'bg-green-500'
                    : 'bg-blue-500'
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
                size="sm"
                className="w-full"
              >
                クエストを開始
              </Button>
            )}
            {onComplete && (
              <Button
                onClick={onComplete}
                variant="success"
                size="sm"
                className="w-full"
              >
                クエストを完了
              </Button>
            )}
          </div>
        </div>

        {/* 追加情報 */}
        {(quest.estimated_time || quest.max_attempts) && (
          <div className="border-t bg-gray-50 px-3 py-2">
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {quest.estimated_time && (
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{quest.estimated_time}分</span>
                </span>
              )}
              {quest.max_attempts && (
                <span className="flex items-center gap-1">
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
