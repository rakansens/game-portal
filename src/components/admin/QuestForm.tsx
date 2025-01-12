import { QuestFormData } from '../../types/quest';

interface QuestFormProps {
  quest: Partial<QuestFormData>;
  onSubmit: (data: QuestFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function QuestForm({ quest, onSubmit, onCancel, loading = false, submitLabel = '保存' }: QuestFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // 必須フィールドのデフォルト値を設定
    const data: QuestFormData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string || 'normal',
      platform: formData.get('platform') as string || null,
      points: parseInt(formData.get('points') as string) || 0,
      status: formData.get('status') as QuestFormData['status'] || 'draft',
      difficulty: parseInt(formData.get('difficulty') as string) || 1,
      is_important: formData.has('is_important'),
      is_limited: formData.has('is_limited'),
      estimated_time: parseInt(formData.get('estimated_time') as string) || null,
      required_points: parseInt(formData.get('required_points') as string) || 0,
      auto_progress: formData.has('auto_progress'),
      verification_required: formData.has('verification_required'),
      verification_type: formData.get('verification_type') as string || null,
      max_attempts: parseInt(formData.get('max_attempts') as string) || null,
      cooldown_period: parseInt(formData.get('cooldown_period') as string) || null,
      external_url: formData.get('external_url') as string || null,
      start_date: formData.get('start_date') as string || null,
      end_date: formData.get('end_date') as string || null,
      participants_limit: parseInt(formData.get('participants_limit') as string) || null,
      banner_url: formData.get('banner_url') as string || null,
      category: formData.get('category') as string || null,
      tags: null, // TODO: タグの実装
      order_position: parseInt(formData.get('order_position') as string) || null,
    };

    console.log('Form data:', data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            タイトル
            <input
              type="text"
              name="title"
              defaultValue={quest.title}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            説明
            <textarea
              name="description"
              defaultValue={quest.description}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            タイプ
            <select
              name="type"
              defaultValue={quest.type || 'normal'}
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
            プラットフォーム
            <select
              name="platform"
              defaultValue={quest.platform || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">なし</option>
              <option value="discord">Discord</option>
              <option value="x">X (Twitter)</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ステータス
            <select
              name="status"
              defaultValue={quest.status || 'draft'}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="draft">下書き</option>
              <option value="active">アクティブ</option>
              <option value="completed">完了</option>
              <option value="archived">アーカイブ</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            難易度
            <input
              type="number"
              name="difficulty"
              defaultValue={quest.difficulty || 1}
              min={1}
              max={5}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ポイント
            <input
              type="number"
              name="points"
              defaultValue={quest.points || 0}
              min={0}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            所要時間（分）
            <input
              type="number"
              name="estimated_time"
              defaultValue={quest.estimated_time || ''}
              min={0}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center space-x-8">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="is_important"
                defaultChecked={quest.is_important || false}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              重要
            </label>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="is_limited"
                defaultChecked={quest.is_limited || false}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              期間限定
            </label>
          </div>
        </div>

        {quest.is_limited && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                開始日時
                <input
                  type="datetime-local"
                  name="start_date"
                  defaultValue={quest.start_date || ''}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                終了日時
                <input
                  type="datetime-local"
                  name="end_date"
                  defaultValue={quest.end_date || ''}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                参加人数制限
                <input
                  type="number"
                  name="participants_limit"
                  defaultValue={quest.participants_limit || ''}
                  min={0}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? '保存中...' : submitLabel}
        </button>
      </div>
    </form>
  );
}