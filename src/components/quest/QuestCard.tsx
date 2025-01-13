import Link from 'next/link';
import { Quest } from '@/types/quest';
import { Badge } from '@/components/user/ui/Badge';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  // 日付をフォーマットする関数
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

  // 期間の状態を取得する関数
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
    <div className="relative">
      {quest.is_important && (
        <div className="absolute right-0 top-0">
          <Badge variant="danger">重要</Badge>
        </div>
      )}
      {quest.is_limited && (
        <div className="absolute left-0 top-0">
          <Badge variant="warning">期間限定</Badge>
        </div>
      )}
      
      <Link
        href={`/quest/${quest.id}`}
        className="block rounded-lg border-2 border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-100 active:bg-blue-50"
      >
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{quest.title}</h3>
            <div className="flex items-center space-x-2">
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
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{quest.description}</p>

          {/* 期間情報の表示 */}
          {quest.is_limited && (
            <div className="mt-2 space-y-1 text-sm">
              {periodStatus && (
                <Badge variant={periodStatus.variant as any}>
                  {periodStatus.text}
                </Badge>
              )}
              <div className="text-gray-600">
                {quest.start_date && (
                  <div>開始: {formatDate(quest.start_date)}</div>
                )}
                {quest.end_date && (
                  <div>終了: {formatDate(quest.end_date)}</div>
                )}
              </div>
            </div>
          )}

          {/* 参加人数制限の表示 */}
          {quest.participants_limit !== null && quest.participants_limit > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              参加者: {quest.participant_count || 0} / {quest.participants_limit}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">難易度:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < quest.difficulty ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          {quest.points && quest.points > 0 && (
            <div className="text-right">
              <Badge variant="success" className="text-sm font-medium">
                {quest.points} Points
              </Badge>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
