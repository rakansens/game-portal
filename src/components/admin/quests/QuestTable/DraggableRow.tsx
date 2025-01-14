'use client';

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Quest } from '@/types/quest';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { cn } from '@/utils/cn';

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
    backgroundColor: isDragging ? 'var(--tw-bg-opacity-5)' : undefined,
  } as const;

  return (
    <tr 
      ref={setNodeRef} 
      style={style}
      className={cn(
        'group transition-colors duration-150',
        'hover:bg-gray-50'
      )}
    >
      <td className="w-10 px-2">
        <div
          {...attributes}
          {...listeners}
          className="flex h-full cursor-move items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
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
          className="capitalize"
        >
          {quest.status}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant="info" className="capitalize">
          {quest.type}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm text-gray-900">
            <span className="font-medium">{quest.exp_reward}</span>
            <span className="text-gray-500">EXP</span>
          </div>
          {quest.points && quest.points > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-900">
              <span className="font-medium">{quest.points}</span>
              <span className="text-gray-500">ポイント</span>
            </div>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-col gap-1 text-sm text-gray-500">
          {quest.start_date && (
            <div className="flex items-center gap-1">
              <span>開始:</span>
              <span className="font-medium text-gray-900">
                {format(new Date(quest.start_date), 'yyyy/MM/dd', {
                  locale: ja,
                })}
              </span>
            </div>
          )}
          {quest.end_date && (
            <div className="flex items-center gap-1">
              <span>終了:</span>
              <span className="font-medium text-gray-900">
                {format(new Date(quest.end_date), 'yyyy/MM/dd', {
                  locale: ja,
                })}
              </span>
            </div>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right">
        <div className="flex justify-end space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href={`/admin/quests/${quest.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-admin-primary hover:text-admin-primary-hover"
            >
              編集
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            削除
          </Button>
        </div>
      </td>
    </tr>
  );
}