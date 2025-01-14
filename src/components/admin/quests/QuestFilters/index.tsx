'use client';

import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';

type FilterKey = 'type' | 'platform' | 'status';

interface QuestFiltersProps {
  filters?: {
    [K in FilterKey]?: string[];
  };
  onChange: (filters: NonNullable<QuestFiltersProps['filters']>) => void;
}

interface FilterGroup {
  label: string;
  key: FilterKey;
  options: Array<{
    value: string;
    label: string;
    color?: 'success' | 'warning' | 'info' | 'default';
  }>;
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    label: 'タイプ',
    key: 'type',
    options: [
      { value: 'normal', label: 'ノーマル', color: 'default' },
      { value: 'limited_time', label: '期間限定', color: 'warning' },
      { value: 'special', label: 'スペシャル', color: 'info' },
    ],
  },
  {
    label: 'プラットフォーム',
    key: 'platform',
    options: [
      { value: 'discord', label: 'Discord', color: 'info' },
      { value: 'other', label: 'その他', color: 'default' },
    ],
  },
  {
    label: 'ステータス',
    key: 'status',
    options: [
      { value: 'active', label: '公開中', color: 'success' },
      { value: 'draft', label: '下書き', color: 'warning' },
      { value: 'completed', label: '終了', color: 'default' },
    ],
  },
];

export function QuestFilters({ filters = {}, onChange }: QuestFiltersProps) {
  const handleFilterChange = useCallback(
    (group: FilterKey, value: string) => {
      const currentValues = filters[group] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      onChange({
        ...filters,
        [group]: newValues,
      });
    },
    [filters, onChange]
  );

  const clearFilters = useCallback(() => {
    onChange({});
  }, [onChange]);

  const hasActiveFilters = Object.values(filters).some((values) => values?.length > 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-900">フィルター</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 h-7 px-2"
          >
            クリア
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {FILTER_GROUPS.map((group) => (
          <div key={group.key}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-700">{group.label}</h3>
              {filters[group.key]?.length ? (
                <Badge variant="info" size="sm" className="text-xs px-1.5 py-0.5">
                  {filters[group.key]?.length}
                </Badge>
              ) : null}
            </div>
            <div className="space-y-1">
              {group.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(group.key, option.value)}
                  className={cn(
                    'flex w-full cursor-pointer items-center rounded px-2 py-1 text-sm transition-colors',
                    filters[group.key]?.includes(option.value)
                      ? 'bg-admin-primary/10 text-admin-primary'
                      : 'hover:bg-gray-50 text-gray-600'
                  )}
                >
                  <Badge variant={option.color} size="sm" className="text-xs">
                    {option.label}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>適用中のフィルター:</span>
            <span className="font-medium text-gray-900">
              {Object.values(filters).reduce(
                (acc, values) => acc + (values?.length || 0),
                0
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}