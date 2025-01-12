'use client';

import { useState } from 'react';
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

export function QuestTable({ quests, onDelete, onOrderChange }: QuestTableProps) {
  const [items, setItems] = useState(quests);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        if (onOrderChange) {
          onOrderChange(newItems);
        }
        return newItems;
      });
    }
  };

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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                タイトル
              </th>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ステータス
              </th>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                タイプ
              </th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                報酬
              </th>
              <th className="w-28 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                期限
              </th>
              <th className="w-24 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <SortableContext items={items.map((q) => q.id)} strategy={verticalListSortingStrategy}>
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