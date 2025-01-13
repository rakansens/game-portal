'use client';

import { useState, useEffect } from 'react';
import { Quest } from '@/types/supabase';
import { validateQuest } from '@/lib/validations/quest';

interface QuestFormProps {
  quest: Partial<Quest>;
  onSubmit: (data: Quest) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function QuestForm({ quest, onSubmit, onCancel, loading = false, submitLabel = '保存' }: QuestFormProps) {
  const [formState, setFormState] = useState({
    isLimited: quest.is_limited || false,
    isImportant: quest.is_important || false,
    hasParticipantsLimit: quest.participants_limit !== null && quest.participants_limit !== undefined,
  });

  // 日付を datetime-local 用のフォーマットに変換する関数
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // YYYY-MM-DDThh:mm 形式に変換（ローカルタイムゾーン）
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // datetime-local の値を ISO 8601 形式に変換する関数
  const formatDateForSubmit = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      console.error('Error formatting date for submit:', error);
      return null;
    }
  };

  useEffect(() => {
    setFormState({
      isLimited: quest.is_limited || false,
      isImportant: quest.is_important || false,
      hasParticipantsLimit: quest.participants_limit !== null && quest.participants_limit !== undefined,
    });
  }, [quest.is_limited, quest.is_important, quest.participants_limit]);

  const handleCheckboxChange = (name: 'isLimited' | 'isImportant' | 'hasParticipantsLimit') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      [name]: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // 日付データの処理
    const startDate = formData.get('start_date') as string;
    const endDate = formData.get('end_date') as string;

    // 必須フィールドのデフォルト値を設定
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string || 'normal',
      platform: formData.get('platform') as string || null,
      points: parseInt(formData.get('points') as string) || 0,
      status: formData.get('status') as Quest['status'] || 'draft',
      difficulty: parseInt(formData.get('difficulty') as string) || 1,
      is_important: formState.isImportant,
      is_limited: formState.isLimited,
      category: formData.get('category') as string || null,
      tags: null, // TODO: タグの実装
      exp_reward: parseInt(formData.get('points') as string) || 0, // pointsと同じ値を使用
      start_date: formState.isLimited ? formatDateForSubmit(startDate) : null,
      end_date: formState.isLimited ? formatDateForSubmit(endDate) : null,
      participants_limit: formState.hasParticipantsLimit ? parseInt(formData.get('participants_limit') as string) || null : null,
      participant_count: null,
      order_position: parseInt(formData.get('order_position') as string) || 0,
    } as Quest;

    // バリデーション
    const validation = validateQuest(data);
    if (validation.error) {
      alert(validation.error.map(err => `${err.path}: ${err.message}`).join('\n'));
      return;
    }

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

        <div className="lg:col-span-3">
          <div className="flex items-center space-x-8">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="is_important"
                checked={formState.isImportant}
                onChange={handleCheckboxChange('isImportant')}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              重要
            </label>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="is_limited"
                checked={formState.isLimited}
                onChange={handleCheckboxChange('isLimited')}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              期間限定
            </label>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="has_participants_limit"
                checked={formState.hasParticipantsLimit}
                onChange={handleCheckboxChange('hasParticipantsLimit')}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              参加人数制限を設定
            </label>
          </div>
        </div>

        {formState.isLimited && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                開始日時
                <input
                  type="datetime-local"
                  name="start_date"
                  defaultValue={formatDateForInput(quest.start_date)}
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
                  defaultValue={formatDateForInput(quest.end_date)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>
          </>
        )}

        {formState.hasParticipantsLimit && (
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
        )}

        {/* 非表示のorder_positionフィールド */}
        <input
          type="hidden"
          name="order_position"
          defaultValue={quest.order_position || ''}
        />
      </div>

      <div className="mt-6 flex justify-end space-x-3">
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