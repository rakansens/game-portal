'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Quest } from '../../../../../src/types/supabase';
import { QuestFormData } from '../../../../../src/types/quest';
import { QuestForm } from '../../../../../src/components/admin/QuestForm';
import { updateQuest, fetchQuestById } from '../../../../../src/lib/admin-api';
import { APIError } from '../../../../../src/utils/api-utils';
import { questToFormData } from '../../../../../src/utils/quest-utils';

export function EditQuestForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [quest, setQuest] = useState<QuestFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuest = async () => {
    try {
      const data = await fetchQuestById(id);
      console.log('Fetched quest:', data);
      setQuest(questToFormData(data));
    } catch (err) {
      console.error('Error fetching quest:', err);
      setError(
        err instanceof APIError ? err.message : 'クエストの取得に失敗しました'
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuest();
    }
  }, [id]);

  const handleSubmit = async (data: QuestFormData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Updating quest with data:', data);

      // データを更新
      await updateQuest(id, data);
      console.log('Update successful');

      // 更新後のデータを再取得
      await fetchQuest();

      // 管理画面に戻る
      router.push('/admin');
    } catch (err) {
      console.error('Error updating quest:', err);
      setError(
        err instanceof APIError ? err.message : 'クエストの更新に失敗しました'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!quest) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <QuestForm
          quest={quest}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          loading={loading}
          submitLabel="更新"
        />
      </div>
    </div>
  );
}