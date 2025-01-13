'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Quest } from '../../types/supabase';
import Link from 'next/link';
import { memo } from 'react';
import { getStatusBadgeColor, getTypeBadgeColor } from '../../utils/badge-utils';

interface DraggableQuestRowProps {
  quest: Quest;
  onDelete?: (quest: Quest) => void;
}

function DraggableQuestRowComponent({ quest, onDelete }: DraggableQuestRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: quest.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  };

  const formattedEndDate = quest.end_date
    ? new Date(quest.end_date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '-';

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="hover:bg-gray-50"
    >
      <td className="whitespace-nowrap px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{quest.title}</div>
        <div className="text-sm text-gray-500">{quest.description}</div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(
            quest.status
          )}`}
        >
          {quest.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getTypeBadgeColor(
            quest.type
          )}`}
        >
          {quest.type || 'normal'}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        {quest.points && quest.points > 0 && (
          <div className="text-sm text-gray-900">{quest.points} Points</div>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {formattedEndDate}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
        <Link
          href={`/admin/quests/${quest.id}/edit`}
          className="text-blue-600 hover:text-blue-900"
        >
          編集
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(quest)}
            className="ml-4 text-red-600 hover:text-red-900"
          >
            削除
          </button>
        )}
      </td>
    </tr>
  );
}

export const DraggableQuestRow = memo(DraggableQuestRowComponent);