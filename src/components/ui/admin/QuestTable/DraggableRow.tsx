'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { memo } from 'react';
import { getStatusBadgeColor, getTypeBadgeColor } from '@/utils/badge-utils';
import { DraggableRowProps } from './types';

function DraggableRowComponent({ quest, onDelete }: DraggableRowProps) {
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
  };

  const formattedEndDate = quest.end_date
    ? new Date(quest.end_date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '-';

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      if (window.confirm('このクエストを削除してもよろしいですか？')) {
        onDelete(quest);
      }
    }
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group transition-colors duration-200 hover:bg-gray-50 ${
        isDragging ? 'bg-blue-50 shadow-lg' : ''
      }`}
    >
      <td className="w-10 px-2 py-4">
        <div
          {...attributes}
          {...listeners}
          className="flex h-full cursor-move items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <svg
            className="h-5 w-5 text-gray-400 hover:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 12h16M4 16h16"
            />
          </svg>
        </div>
      </td>
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
            onClick={handleDelete}
            className="ml-4 text-red-600 hover:text-red-900"
          >
            削除
          </button>
        )}
      </td>
    </tr>
  );
}

export const DraggableRow = memo(DraggableRowComponent);