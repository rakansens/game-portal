import { BadgeProps } from '../../common/Badge';

export type BadgeVariant = NonNullable<BadgeProps['variant']>;

/**
 * 日付をフォーマットする関数
 * YYYY/MM/DD HH:mm形式に変換
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  
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
    return '';
  }
}

/**
 * 進捗率を計算する関数
 */
export function calculateProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
}

/**
 * バッジのバリアントを取得する関数
 */
export function getBadgeVariant(type: string): BadgeVariant {
  switch (type) {
    case 'limited_time':
      return 'warning';
    case 'roulette':
      return 'purple';
    case 'discord':
      return 'indigo';
    case 'x':
      return 'gray';
    default:
      return 'primary';
  }
}

/**
 * 期限切れかどうかを判定する関数
 */
export function isExpired(endDate: string | null): boolean {
  if (!endDate) return false;
  return new Date(endDate) < new Date();
}

/**
 * 開始前かどうかを判定する関数
 */
export function isNotStarted(startDate: string | null): boolean {
  if (!startDate) return false;
  return new Date(startDate) > new Date();
}