import Link from 'next/link';
import { Quest } from '../../types/supabase';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <div className="relative">
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
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {quest.exp_reward} EXP
            </div>
            {quest.points && quest.points > 0 && (
              <div className="text-sm text-green-600">
                {quest.points} Points
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
