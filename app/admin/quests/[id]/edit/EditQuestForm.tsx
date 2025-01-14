'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Quest } from '@/types/quest';
import { QuestFormData } from '@/types/quest';
import { QuestForm } from '@/components/admin/quests/QuestForm';
import { updateQuest, fetchQuestById } from '@/lib/admin-api';
import { APIError } from '@/utils/api-utils';
import { questToFormData } from '@/utils/quest-utils';

interface EditQuestFormProps {
  questId: string;
}

export function EditQuestForm({ questId }: EditQuestFormProps) {
  const router = useRouter();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadQuest = async () => {
      try {
        const result = await fetchQuestById(questId);
        if (result.error) {
          throw new Error(result.error);
        }
        if (result.data) {
          setQuest(result.data);
        }
      } catch (err) {
        setError('クエストの読み込みに失敗しました');
        console.error('Error loading quest:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuest();
  }, [questId]);

  const handleSubmit = async (data: QuestFormData) => {
    try {
      setIsSubmitting(true);
      const result = await updateQuest(questId, data);
      if (result.error) {
        throw new APIError(result.error);
      }
      router.push('/admin');
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('クエストの更新に失敗しました');
      }
      console.error('Error updating quest:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center text-red-600">
        <p>クエストが見つかりません</p>
      </div>
    );
  }

  return (
    <QuestForm
      initialData={questToFormData(quest)}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/admin')}
      isSubmitting={isSubmitting}
    />
  );
}