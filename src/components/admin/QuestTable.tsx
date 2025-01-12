import Link from 'next/link';
import { Quest } from '../../types/supabase';
import { QuestStatus, QuestType } from '../../types/quest';

interface QuestTableProps {
  quests: Quest[];
  onDelete?: (id: string) => void;
}

export function QuestTable({ quests, onDelete }: QuestTableProps) {
  const getStatusBadgeColor = (status: QuestStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeColor = (type: QuestType) => {
    switch (type) {
      case 'limited_time':
        return 'bg-purple-100 text-purple-800';
      case 'roulette':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              タイトル
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              ステータス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              タイプ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              報酬
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              期限
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {quests.map((quest) => (
            <tr key={quest.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{quest.title}</div>
                <div className="text-sm text-gray-500">{quest.description}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  getStatusBadgeColor(quest.status as QuestStatus)
                }`}>
                  {quest.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  getTypeBadgeColor(quest.type as QuestType)
                }`}>
                  {quest.type}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">{quest.exp_reward} EXP</div>
                {quest.points && quest.points > 0 && (
                  <div className="text-sm text-gray-500">{quest.points} Points</div>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {quest.end_date ? new Date(quest.end_date).toLocaleDateString() : '-'}
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
                    onClick={() => onDelete(quest.id)}
                    className="ml-4 text-red-600 hover:text-red-900"
                  >
                    削除
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}