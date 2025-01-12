import { Quest } from '../../types/supabase';
import { QuestFormData, QuestStatus, QuestType } from '../../types/quest';

interface QuestFormProps {
  quest: Partial<QuestFormData>;
  onSubmit: (quest: Partial<QuestFormData>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function QuestForm({ quest, onSubmit, onCancel, loading, submitLabel = '保存' }: QuestFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(quest);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            タイトル
            <input
              type="text"
              value={quest.title || ''}
              onChange={(e) => onSubmit({ ...quest, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            説明
            <textarea
              value={quest.description || ''}
              onChange={(e) => onSubmit({ ...quest, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            タイプ
            <select
              value={quest.type || ''}
              onChange={(e) => onSubmit({ ...quest, type: e.target.value as QuestType })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="normal">通常</option>
              <option value="limited_time">期間限定</option>
              <option value="roulette">ルーレット</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ステータス
            <select
              value={quest.status || ''}
              onChange={(e) => onSubmit({ ...quest, status: e.target.value as QuestStatus })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="draft">下書き</option>
              <option value="active">アクティブ</option>
              <option value="archived">アーカイブ</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            EXP報酬
            <input
              type="number"
              value={quest.exp_reward || 0}
              onChange={(e) => onSubmit({ ...quest, exp_reward: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ポイント報酬
            <input
              type="number"
              value={quest.points || 0}
              onChange={(e) => onSubmit({ ...quest, points: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            難易度
            <input
              type="number"
              value={quest.difficulty || 1}
              onChange={(e) => onSubmit({ ...quest, difficulty: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="1"
              max="5"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            予想所要時間（分）
            <input
              type="number"
              value={quest.estimated_time || 0}
              onChange={(e) => onSubmit({ ...quest, estimated_time: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
            />
          </label>
        </div>

        <div className="lg:col-span-2">
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quest.is_important || false}
                onChange={(e) => onSubmit({ ...quest, is_important: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">重要</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quest.is_limited || false}
                onChange={(e) => onSubmit({ ...quest, is_limited: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">期間限定</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? '保存中...' : submitLabel}
        </button>
      </div>
    </form>
  );
}