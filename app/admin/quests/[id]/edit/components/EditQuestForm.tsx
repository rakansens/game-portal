'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Quest, QuestFormData } from '@/types/quest';
import { QuestForm } from '@/components/admin/quests/QuestForm';
import { updateQuest } from '@/features/admin/quests/actions';
import { questToFormData } from '@/utils/quest-utils';

interface EditQuestFormProps {
  quest: Quest;
}

export function EditQuestForm({ quest }: EditQuestFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: QuestFormData) => {
    try {
      setIsSubmitting(true);
      const result = await updateQuest(quest.id, {
        ...data,
        id: quest.id,
        created_at: quest.created_at,
        updated_at: quest.updated_at,
      });
      
      if (result.error) {
        throw new Error(result.error);
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Failed to update quest:', error);
      alert('クエストの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <QuestForm
      initialData={questToFormData(quest)}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isSubmitting={isSubmitting}
    />
  );
}