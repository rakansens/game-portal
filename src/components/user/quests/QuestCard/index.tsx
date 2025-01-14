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
          'relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md',
          isImportant && 'border-yellow-400 bg-yellow-50',
          isLimited && 'border-blue-400'
        )}
      >
        {/* ヘッダー部分 */}
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900">{quest.title}</h3>
          <div className="flex gap-1">
            <Badge variant={quest.type === 'normal' ? 'default' : 'special'}>
              {quest.type === 'normal' ? 'ノーマル' : 'スペシャル'}
            </Badge>
            {isLimited && <Badge variant="limited">期間限定</Badge>}
          </div>
        </div>

        {/* 説明文 */}
        <p className="mb-4 text-sm text-gray-600">{quest.description}</p>

        {/* 報酬情報 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {quest.exp_reward > 0 && (
            <Badge variant="exp" size="lg" className="flex items-center gap-1">
              <span className="font-bold">{quest.exp_reward}</span>
              <span>EXP</span>
            </Badge>
          )}
          {quest.points > 0 && (
            <Badge variant="points" size="lg" className="flex items-center gap-1">
              <span className="font-bold">{quest.points}</span>
              <span>ポイント</span>
            </Badge>
          )}
        </div>

        {/* 期間情報 */}
        {isLimited && quest.start_date && quest.end_date && (
          <div className="mb-4 rounded-md bg-blue-50 p-2 text-xs text-blue-700">
            <div className="flex items-center gap-2">
              <span>期間：</span>
              <span>
                {format(new Date(quest.start_date), 'M/d', { locale: ja })} 〜{' '}
                {format(new Date(quest.end_date), 'M/d', { locale: ja })}
              </span>
            </div>
          </div>
        )}

        {/* 進捗情報 */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>進捗状況</span>
            <span className="font-medium">
              {quest.participant_count || 0}/{quest.participants_limit || '∞'}
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
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
              className="w-full"
            >
              クエストを開始
            </Button>
          )}
          {onComplete && (
            <Button
              onClick={onComplete}
              variant="success"
              size="lg"
              className="w-full"
            >
              クエストを完了
            </Button>
          )}
        </div>

        {/* 追加情報 */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
          {quest.estimated_time && (
            <span className="flex items-center gap-1">
              <span>⏱️ 目安時間：</span>
              <span>{quest.estimated_time}分</span>
            </span>
          )}
          {quest.max_attempts && (
            <span className="flex items-center gap-1">
              <span>🔄 挑戦回数：</span>
              <span>最大{quest.max_attempts}回</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
