import { Quest } from '../../types/liff';
import Link from 'next/link';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <Link href={`/quest/${quest.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{quest.title}</h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-800">
              {quest.category}
            </span>
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
          <span className="text-sm font-medium text-green-600">
            報酬: {quest.reward}pt
          </span>
        </div>
        {quest.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {quest.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
