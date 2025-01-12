'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quest } from '../../../../../src/types/supabase';
import { updateQuest } from '../../../../../src/lib/admin-api';
import { fetchQuests } from '../../../../../src/lib/api';

export default function EditQuest({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuest = async () => {
      try {
        setLoading(true);
        const quests = await fetchQuests();
        const foundQuest = quests.find((q: Quest) => q.id === params.id);
        if (!foundQuest) {
          throw new Error('クエストが見つかりません');
        }
        setQuest(foundQuest);
      } catch (err) {
        console.error('Error loading quest:', err);
        setError(err instanceof Error ? err.message : 'クエストの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadQuest();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quest) return;

    try {
      setSaving(true);
      await updateQuest({ ...quest, id: params.id });
      router.push('/admin');
    } catch (err) {
      console.error('Error updating quest:', err);
      setError(err instanceof Error ? err.message : 'クエストの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center text-red-600">
        <p>{error || 'クエストが見つかりません'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">クエストの編集</h1>
        <p className="mt-2 text-sm text-gray-600">ID: {quest.id}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              タイトル
              <input
                type="text"
                value={quest.title}
                onChange={(e) => setQuest({ ...quest, title: e.target.value })}
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
                onChange={(e) => setQuest({ ...quest, type: e.target.value || null })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="normal">通常</option>
                <option value="limited_time">期間限定</option>
                <option value="roulette">ルーレット</option>
              </select>
            </label>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              説明
              <textarea
                value={quest.description}
                onChange={(e) => setQuest({ ...quest, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              EXP報酬
              <input
                type="number"
                value={quest.exp_reward}
                onChange={(e) => setQuest({ ...quest, exp_reward: parseInt(e.target.value) })}
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
                onChange={(e) => setQuest({ ...quest, points: parseInt(e.target.value) })}
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
                value={quest.difficulty}
                onChange={(e) => setQuest({ ...quest, difficulty: parseInt(e.target.value) })}
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
                onChange={(e) => setQuest({ ...quest, estimated_time: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={quest.is_important}
              onChange={(e) => setQuest({ ...quest, is_important: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">重要</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={quest.is_limited}
              onChange={(e) => setQuest({ ...quest, is_limited: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">期間限定</span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}