'use client';

import { useCallback } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Checkbox } from '@/components/admin/ui/Checkbox/index';

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
  }>;
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    label: 'タイプ',
    key: 'type',
    options: [
      { value: 'normal', label: 'ノーマル' },
      { value: 'limited_time', label: '期間限定' },
      { value: 'special', label: 'スペシャル' },
    ],
  },
  {
    label: 'プラットフォーム',
    key: 'platform',
    options: [
      { value: 'discord', label: 'Discord' },
      { value: 'other', label: 'その他' },
    ],
  },
  {
    label: 'ステータス',
    key: 'status',
    options: [
      { value: 'active', label: '公開中' },
      { value: 'draft', label: '下書き' },
      { value: 'completed', label: '終了' },
    ],
  },
];

export function QuestFilters({ filters = {}, onChange }: QuestFiltersProps) {
  const handleFilterChange = useCallback(
    (group: FilterKey, value: string, checked: boolean) => {
      const currentValues = filters[group] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

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
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">フィルター</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            クリア
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {FILTER_GROUPS.map((group) => (
          <div key={group.key} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">{group.label}</h3>
            <div className="space-y-2">
              {group.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <Checkbox
                    id={`${group.key}-${option.value}`}
                    checked={filters[group.key]?.includes(option.value) || false}
                    onCheckedChange={(checked: boolean) =>
                      handleFilterChange(group.key, option.value, checked)
                    }
                  />
                  <label
                    htmlFor={`${group.key}-${option.value}`}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
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