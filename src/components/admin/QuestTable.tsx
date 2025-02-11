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
import { Quest } from '../../types/supabase';
import { DraggableQuestRow } from './DraggableQuestRow';

interface QuestTableProps {
  quests: Quest[];
  onDelete?: (quest: Quest) => void;
  onOrderChange?: (quests: Quest[]) => void;
}

const TABLE_HEADERS = [
  { label: 'タイトル', className: '' },
  { label: 'ステータス', className: 'w-24' },
  { label: 'タイプ', className: 'w-24' },
  { label: '報酬', className: 'w-32' },
  { label: '期限', className: 'w-28' },
  { label: '操作', className: 'w-24 text-right' },
] as const;

export function QuestTable({ quests, onDelete, onOrderChange }: QuestTableProps) {
  const [items, setItems] = useState(quests);

  const sensors = useSensors(
    useSensor(PointerSensor),
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

          // 並び順を更新
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

  // quests propが変更されたら items を更新
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header.label}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${header.className}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <SortableContext
              items={sortableItems}
              strategy={verticalListSortingStrategy}
            >
              {items.map((quest) => (
                <DraggableQuestRow
                  key={quest.id}
                  quest={quest}
                  onDelete={onDelete ? () => onDelete(quest) : undefined}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </div>
    </DndContext>
  );
}