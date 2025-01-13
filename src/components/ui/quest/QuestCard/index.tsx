'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Quest } from '@/types/shared';
import { cn } from '@/utils/cn';
import { formatDate, getBadgeVariant, BadgeVariant } from './utils';
import { Badge } from '../../common/Badge';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  // 期間の状態を取得する関数
  const getPeriodStatus = () => {
    if (!quest.is_limited) return null;

    const now = new Date();
    const startDate = quest.start_date ? new Date(quest.start_date) : null;
    const endDate = quest.end_date ? new Date(quest.end_date) : null;

    if (startDate && now < startDate) {
      return { text: '開始前', variant: 'info' as BadgeVariant };
    } else if (endDate && now > endDate) {
      return { text: '終了', variant: 'gray' as BadgeVariant };
    } else if (startDate || endDate) {
      return { text: '開催中', variant: 'success' as BadgeVariant };
    }
    return null;
  };

  const periodStatus = getPeriodStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      {/* 重要バッジ */}
      {quest.is_important && (
        <div className="absolute -right-1 top-3 z-10 rotate-3">
          <Badge variant="danger" size="sm" className="shadow-lg">
            重要
          </Badge>
        </div>
      )}

      {/* 期間限定バッジ */}
      {quest.is_limited && (
        <div className="absolute -left-1 top-3 z-10 -rotate-3">
          <Badge variant="warning" size="sm" className="shadow-lg">
            期間限定
          </Badge>
        </div>
      )}

      <div className={cn(
        // ベースのスタイル
        "relative overflow-hidden rounded-xl border bg-white p-4",
        "transition-all duration-300 ease-in-out",
        // 影とグラデーション
        "border-gray-100",
        "bg-gradient-to-br from-white to-gray-50",
        "shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]",
        // タップ効果
        "active:shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1)]",
        "active:translate-y-0.5",
      )}>
        {/* カードヘッダー */}
        <div className="mb-3">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-bold text-gray-900 line-clamp-2">
              {quest.title}
            </h3>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={getBadgeVariant(quest.type || '')}
                size="sm"
              >
                {quest.type === 'limited_time' ? '期間限定' :
                 quest.type === 'roulette' ? 'ルーレット' :
                 '通常'}
              </Badge>
              {quest.platform && (
                <Badge
                  variant={getBadgeVariant(quest.platform)}
                  size="sm"
                >
                  {quest.platform === 'discord' ? 'Discord' :
                   quest.platform === 'x' ? 'X' :
                   quest.platform}
                </Badge>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {quest.description}
          </p>
        </div>

        {/* 期間情報 */}
        {quest.is_limited && (
          <div className="mb-3 space-y-2">
            {periodStatus && (
              <Badge variant={periodStatus.variant} size="sm">
                {periodStatus.text}
              </Badge>
            )}
            <div className="space-y-1">
              {quest.start_date && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">開始:</span>
                  <span>{formatDate(quest.start_date)}</span>
                </div>
              )}
              {quest.end_date && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">終了:</span>
                  <span>{formatDate(quest.end_date)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 参加人数 */}
        {quest.participants_limit !== null && quest.participants_limit > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">参加者:</span>
              <div className="relative h-1.5 flex-1 rounded-full bg-gray-100">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-blue-500"
                  style={{
                    width: `${Math.min(
                      ((quest.participant_count || 0) / quest.participants_limit) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {quest.participant_count || 0} / {quest.participants_limit}
              </span>
            </div>
          </div>
        )}

        {/* カードフッター */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">難易度:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < quest.difficulty ? "text-yellow-400" : "text-gray-200"
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          {quest.points && quest.points > 0 && (
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-green-600">
                {quest.points}
              </span>
              <span className="text-xs font-medium text-green-600">
                Points
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}