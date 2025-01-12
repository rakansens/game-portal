import type { QuestFilters } from '../../types/quest';

interface QuestFilterBarProps {
  filters: QuestFilters;
  onChange: (filters: QuestFilters) => void;
}

export function QuestFilterBar({ filters, onChange }: QuestFilterBarProps) {
  return (
    <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5">
      <div className="flex items-center space-x-4">
        <div className="w-64">
          <label htmlFor="search" className="sr-only">
            検索
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="block w-full rounded-md border-gray-300 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="クエストを検索..."
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">すべてのタイプ</option>
            <option value="normal">通常</option>
            <option value="limited_time">期間限定</option>
            <option value="roulette">ルーレット</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">すべてのステータス</option>
            <option value="active">アクティブ</option>
            <option value="draft">下書き</option>
            <option value="archived">アーカイブ</option>
          </select>
        </div>
      </div>
    </div>
  );
}