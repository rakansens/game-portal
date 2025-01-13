'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { Quest } from '@/types/quest';
import { Badge } from '@/components/user/ui/Badge';

interface QuestCardProps {
  quest: Quest;
}

export const QuestCard: FC<QuestCardProps> = ({ quest }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Tokyo'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const getPeriodStatus = () => {
    if (!quest.is_limited) return null;

    const now = new Date();
    const startDate = quest.start_date ? new Date(quest.start_date) : null;
    const endDate = quest.end_date ? new Date(quest.end_date) : null;

    if (startDate && now < startDate) {
      return {
        text: '開始前',
        variant: 'info'
      };
    } else if (endDate && now > endDate) {
      return {
        text: '終了',
        variant: 'secondary'
      };
    } else if (startDate || endDate) {
      return {
        text: '開催中',
        variant: 'success'
      };
    }
    return null;
  };

  const periodStatus = getPeriodStatus();

  return (
    <Link
      href={`/quest/${quest.id}`}
      className="group block overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-md"
    >
      {/* カードヘッダー（バナー画像またはグラデーション背景） */}
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-500">
        {quest.banner_url ? (
          <img
            src={quest.banner_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : null}
        {/* 重要バッジ */}
        {quest.is_important && (
          <div className="absolute right-3 top-3">
            <Badge variant="danger" size="lg">重要</Badge>
          </div>
        )}
        {/* 期間限定バッジ */}
        {quest.is_limited && (
          <div className="absolute left-3 top-3">
            <Badge variant="warning" size="lg">期間限定</Badge>
          </div>
        )}
      </div>

      {/* カードコンテンツ */}
      <div className="p-4">
        {/* タイトルと種類 */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={
              quest.type === 'limited_time' ? 'warning' :
              quest.type === 'roulette' ? 'purple' :
              'info'
            }>
              {quest.type === 'limited_time' ? '期間限定' :
               quest.type === 'roulette' ? 'ルーレット' :
               '通常'}
            </Badge>
            {quest.platform && (
              <Badge variant={
                quest.platform === 'discord' ? 'indigo' :
                quest.platform === 'x' ? 'secondary' :
                'secondary'
              }>
                {quest.platform === 'discord' ? 'Discord' :
                 quest.platform === 'x' ? 'X' :
                 quest.platform}
              </Badge>
            )}
          </div>
          <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-blue-600">
            {quest.title}
          </h3>
        </div>

        {/* 説明文 */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {quest.description}
        </p>

        {/* 期間情報 */}
        {quest.is_limited && (
          <div className="mb-4 space-y-2">
            {periodStatus && (
              <Badge variant={periodStatus.variant as any} size="lg">
                {periodStatus.text}
              </Badge>
            )}
            <div className="space-y-1 text-sm text-gray-500">
              {quest.start_date && (
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>開始: {formatDate(quest.start_date)}</span>
                </div>
              )}
              {quest.end_date && (
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>終了: {formatDate(quest.end_date)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* カード下部の情報 */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          {/* 難易度 */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-600">難易度:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < quest.difficulty ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          {/* ポイントと参加者数 */}
          <div className="flex items-center gap-3">
            {quest.participants_limit !== null && quest.participants_limit > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{quest.participant_count || 0}/{quest.participants_limit}</span>
              </div>
            )}
            {quest.points && quest.points > 0 && (
              <Badge variant="success" size="lg" className="font-medium">
                {quest.points} Points
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
