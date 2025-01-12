import { Quest } from '../../types/supabase';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  const hasDeadline = quest.end_date !== null && quest.end_date !== undefined;
  const isExpired = hasDeadline && quest.end_date ? new Date(quest.end_date) < new Date() : false;
  const isActive = quest.status === 'active';

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quest.external_url) {
      window.open(quest.external_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-lg border ${
      quest.is_important ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
    } p-4 shadow-sm transition-all hover:shadow-md ${!isActive && 'opacity-60'}`}>
      {quest.is_important && (
        <div className="absolute right-0 top-0">
          <span className="inline-block bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            重要
          </span>
        </div>
      )}
      {quest.is_limited && (
        <div className="absolute left-0 top-0">
          <span className="inline-block bg-yellow-500 px-2 py-1 text-xs font-semibold text-white">
            期間限定
          </span>
        </div>
      )}
      
      <Link
        href={`/quest/${quest.id}`}
        className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 active:bg-gray-50"
      >
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{quest.title}</h3>
            <div className="flex items-center space-x-2">
              <span className={`rounded-full px-2.5 py-0.5 text-sm ${
                quest.type === 'limited_time' ? 'bg-yellow-100 text-yellow-800' :
                quest.type === 'roulette' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {quest.type || quest.category}
              </span>
              {quest.platform && (
                <span className={`rounded-full px-2.5 py-0.5 text-sm ${
                  quest.platform === 'discord' ? 'bg-indigo-100 text-indigo-800' :
                  quest.platform === 'x' ? 'bg-gray-100 text-gray-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {quest.platform === 'discord' ? 'Discord' :
                   quest.platform === 'x' ? 'X' :
                   quest.platform}
                </span>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{quest.description}</p>
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
          <div className="flex items-center space-x-2">
            {quest.points && quest.points > 0 && (
              <span className="text-sm font-medium text-green-600">
                {quest.points} Points
              </span>
            )}
            {quest.exp_reward > 0 && (
              <span className="text-sm font-medium text-blue-600">
                {quest.exp_reward} EXP
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          {quest.estimated_time && quest.estimated_time > 0 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              約{quest.estimated_time}分
            </span>
          )}
          
          {hasDeadline && quest.end_date && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
              isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              {isExpired ? '期限切れ' : `${format(new Date(quest.end_date), 'M/d HH:mm', { locale: ja })}まで`}
            </span>
          )}

          {quest.participants_limit && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
              (quest.participant_count || 0) >= quest.participants_limit
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {(quest.participant_count || 0) >= quest.participants_limit ? (
                '満員'
              ) : (
                <>
                  <span className="font-medium">{quest.participant_count || 0}</span>
                  <span className="mx-1">/</span>
                  <span>{quest.participants_limit}人</span>
                </>
              )}
            </span>
          )}

          {quest.participant_count !== null && quest.participant_count > 0 && quest.completion_rate !== null && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs text-blue-600">
              達成率: {Math.round(quest.completion_rate * 100)}%
            </span>
          )}
        </div>

        {quest.external_url && (
          <button
            onClick={handleExternalLinkClick}
            className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            外部リンク
          </button>
        )}
      </div>
    </div>
  );
}
