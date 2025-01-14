'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/utils/cn';
import { Button } from '@/components/admin/ui/Button';
import { DraggableRow } from './DraggableRow';
import type { Quest } from '@/types/quest';

interface QuestTableProps {
  quests: Quest[];
  onDelete?: (quest: Quest) => void;
  onOrderChange?: (quests: Quest[]) => void;
}

const TABLE_HEADERS = [
  { label: '', className: 'w-10 px-2' }, // ドラッグハンドル用
  { label: 'タイトル', className: 'px-6' },
  { label: 'ステータス', className: 'w-24 px-6' },
  { label: 'タイプ', className: 'w-24 px-6' },
  { label: '報酬', className: 'w-32 px-6' },
  { label: '期限', className: 'w-28 px-6' },
  { label: '操作', className: 'w-24 px-6 text-right' },
] as const;

export function QuestTable({ quests, onDelete, onOrderChange }: QuestTableProps) {
  const [items, setItems] = useState(quests);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
            ...item,
            order_position: index,
          }));

          onOrderChange?.(newItems);
          return newItems;
        });
      }
    },
    [onOrderChange]
  );

  useEffect(() => {
    setItems(quests);
  }, [quests]);

  const sortableItems = useMemo(() => items.map((q) => q.id), [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header.label}
                    scope="col"
                    className={cn(
                      header.className,
                      'py-3.5 text-left text-sm font-medium text-gray-900'
                    )}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
                {items.map((quest) => (
                  <DraggableRow
                    key={quest.id}
                    quest={quest}
                    onDelete={() => onDelete?.(quest)}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">クエストがありません</h3>
            <p className="mt-1 text-sm text-gray-500">新しいクエストを作成してください。</p>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => window.location.href = '/admin/quests/new'}
                className="inline-flex items-center"
              >
                <svg
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
                  />
                </svg>
                クエストを作成
              </Button>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}