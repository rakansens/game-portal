'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quest } from '../../../../../src/types/supabase';
import { QuestFormData } from '../../../../../src/types/quest';
import { QuestForm } from '../../../../../src/components/admin/QuestForm';
import { updateQuest } from '../../../../../src/lib/admin-api';

interface EditQuestProps {
  params: {
    id: string;
  };
}

export default function EditQuest({ params }: EditQuestProps) {
  const router = useRouter();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const response = await fetch(`/api/admin/quests?id=${params.id}`);
        if (!response.ok) {
          throw new Error('クエストの取得に失敗しました');
        }
        const data = await response.json();
        setQuest(data);
      } catch (err) {
        console.error('Error fetching quest:', err);
        setError(err instanceof Error ? err.message : 'クエストの取得に失敗しました');
      }
    };

    fetchQuest();
  }, [params.id]);

  const handleSubmit = async (data: QuestFormData) => {
    try {
      setLoading(true);
      setError(null);
      await updateQuest({ ...data, id: params.id });
      router.push('/admin');
    } catch (err) {
      console.error('Error updating quest:', err);
      setError(err instanceof Error ? err.message : 'クエストの更新に失敗しました');
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
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">クエストの編集</h1>
        <p className="mt-1 text-sm text-gray-600">クエストの内容を編集します。</p>
      </div>

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