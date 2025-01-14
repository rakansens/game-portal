'use client';

import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/admin/ui/Button';
import { Checkbox } from '@/components/admin/ui/Checkbox/index';
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

      <div className="space-y-6">
        {FILTER_GROUPS.map((group) => (
          <div key={group.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{group.label}</h3>
              {filters[group.key]?.length ? (
                <Badge variant="info" size="sm">
                  {filters[group.key]?.length}個選択中
                </Badge>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {group.options.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-center rounded-lg border p-3 transition-colors',
                    filters[group.key]?.includes(option.value)
                      ? 'border-admin-primary bg-admin-primary/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <Checkbox
                    id={`${group.key}-${option.value}`}
                    checked={filters[group.key]?.includes(option.value) || false}
                    onCheckedChange={(checked: boolean) =>
                      handleFilterChange(group.key, option.value, checked)
                    }
                    className="sr-only"
                  />
                  <div className="ml-2 flex items-center gap-2">
                    <Badge variant={option.color} size="sm">
                      {option.label}
                    </Badge>
                  </div>
                </label>
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