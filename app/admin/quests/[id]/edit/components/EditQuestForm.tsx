'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Quest } from '@/types/supabase';
import { QuestForm } from '@/components/ui/forms/QuestForm';
import { updateQuest } from '@/features/admin/quests/actions';

interface EditQuestFormProps {
  quest: Quest;
}

export function EditQuestForm({ quest }: EditQuestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Quest) => {
    try {
      setLoading(true);
      const result = await updateQuest(quest.id, data);
      
      if (result.error) {
        throw new Error(result.error);
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Failed to update quest:', error);
      alert('クエストの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuestForm
      quest={quest}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      loading={loading}
      submitLabel="更新"
    />
  );
}