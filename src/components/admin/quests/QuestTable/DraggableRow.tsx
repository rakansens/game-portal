'use client';

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Quest } from '@/types/quest';
import { Badge } from '@/components/shared/ui/Badge';

interface DraggableRowProps {
  quest: Quest;
  onDelete?: () => void;
}

export function DraggableRow({ quest, onDelete }: DraggableRowProps) {
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
    zIndex: isDragging ? 1 : 0,
    position: isDragging ? 'relative' : 'static',
    opacity: isDragging ? 0.5 : 1,
  } as const;

  return (
    <tr ref={setNodeRef} style={style}>
      <td className="w-10 px-2">
        <div
          {...attributes}
          {...listeners}
          className="flex h-full cursor-move items-center justify-center"
        >
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{quest.title}</div>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge
          variant={
            quest.status === 'active'
              ? 'success'
              : quest.status === 'draft'
              ? 'warning'
              : quest.status === 'completed'
              ? 'primary'
              : 'default'
          }
        >
          {quest.status}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant="info">{quest.type}</Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-col space-y-1">
          <Badge variant="success">{quest.exp_reward} EXP</Badge>
          {quest.points && (
            <Badge variant="primary">{quest.points} ポイント</Badge>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-col space-y-1 text-sm text-gray-500">
          {quest.start_date && (
            <div>
              開始:{' '}
              {format(new Date(quest.start_date), 'yyyy/MM/dd', {
                locale: ja,
              })}
            </div>
          )}
          {quest.end_date && (
            <div>
              終了:{' '}
              {format(new Date(quest.end_date), 'yyyy/MM/dd', {
                locale: ja,
              })}
            </div>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
        <div className="flex justify-end space-x-2">
          <Link
            href={`/admin/quests/${quest.id}/edit`}
            className="text-blue-600 hover:text-blue-900"
          >
            編集
          </Link>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            削除
          </button>
        </div>
      </td>
    </tr>
  );
}