'use client';

import React from 'react';
import { Quest } from '@/types/quest';
import { Select } from '@/components/admin/ui/Select';
import { Checkbox } from '@/components/admin/ui/Checkbox';

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
      <Select
        label="タイプ"
        value={filters.type}
        onChange={(e) => handleFilterChange('type', e.target.value)}
      >
        <option value="">すべて</option>
        {uniqueTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      <Select
        label="プラットフォーム"
        value={filters.platform}
        onChange={(e) => handleFilterChange('platform', e.target.value)}
      >
        <option value="">すべて</option>
        {uniquePlatforms.map((platform) => (
          <option key={platform} value={platform}>
            {platform}
          </option>
        ))}
      </Select>

      <Select
        label="ステータス"
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <option value="">すべて</option>
        <option value="draft">下書き</option>
        <option value="active">アクティブ</option>
        <option value="completed">完了</option>
        <option value="archived">アーカイブ</option>
      </Select>

      <div className="flex items-center space-x-4">
        <Checkbox
          label="期間限定のみ"
          checked={filters.isLimited || false}
          onChange={(e) => handleFilterChange('isLimited', e.target.checked || null)}
        />

        <Checkbox
          label="重要のみ"
          checked={filters.isImportant || false}
          onChange={(e) => handleFilterChange('isImportant', e.target.checked || null)}
        />
      </div>
    </div>
  );
}

export default QuestFilters;