'use client';

import React from 'react';
import { Quest } from '@/types/supabase';

interface QuestFiltersProps {
  quests: Quest[];
  onFilterChange: (filters: QuestFilters) => void;
}

export interface QuestFilters {
  type: string;
  platform: string;
  status: string;
  isLimited: boolean | null;
  isImportant: boolean | null;
}

export function QuestFilters({ quests, onFilterChange }: QuestFiltersProps) {
  const [filters, setFilters] = React.useState<QuestFilters>({
    type: '',
    platform: '',
    status: '',
    isLimited: null,
    isImportant: null,
  });

  const handleFilterChange = (key: keyof QuestFilters, value: string | boolean | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters as QuestFilters);
    onFilterChange(newFilters as QuestFilters);
  };

  const uniqueTypes = React.useMemo(() => {
    const types = new Set(quests.map((quest) => quest.type || ''));
    return Array.from(types) as string[];
  }, [quests]);

  const uniquePlatforms = React.useMemo(() => {
    const platforms = new Set(quests.map((quest) => quest.platform || '').filter(Boolean));
    return Array.from(platforms) as string[];
  }, [quests]);

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">タイプ</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="">すべて</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">プラットフォーム</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.platform}
          onChange={(e) => handleFilterChange('platform', e.target.value)}
        >
          <option value="">すべて</option>
          {uniquePlatforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ステータス</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">すべて</option>
          <option value="draft">下書き</option>
          <option value="active">アクティブ</option>
          <option value="completed">完了</option>
          <option value="archived">アーカイブ</option>
        </select>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={filters.isLimited || false}
            onChange={(e) => handleFilterChange('isLimited', e.target.checked || null)}
          />
          <span className="ml-2 text-sm text-gray-700">期間限定のみ</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={filters.isImportant || false}
            onChange={(e) => handleFilterChange('isImportant', e.target.checked || null)}
          />
          <span className="ml-2 text-sm text-gray-700">重要のみ</span>
        </label>
      </div>
    </div>
  );
}

export default QuestFilters;