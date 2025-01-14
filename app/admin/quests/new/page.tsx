'use client';

import { useRouter } from 'next/navigation';
import { CreateQuestInput, QuestFormData } from '@/types/quest';
import { QuestForm } from '@/components/admin/quests/QuestForm';
import { createQuest } from '@/lib/admin-api';

const initialQuest: QuestFormData = {
  title: '',
  description: '',
  type: null,
  platform: null,
  points: 0,
  status: 'draft',
  difficulty: 1,
  is_important: false,
  is_limited: false,
  category: null,
  tags: null,
  exp_reward: 0,
  start_date: null,
  end_date: null,
  participants_limit: null,
  order_position: 0,
  estimated_time: null,
  required_points: null,
  auto_progress: false,
  verification_required: false,
  verification_type: null,
  max_attempts: null,
  cooldown_period: null,
  external_url: null,
  banner_url: null,
};

export default function NewQuestPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateQuestInput) => {
    try {
      const result = await createQuest(data);
      if (result.error) {
        throw new Error(result.error);
      }
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Failed to create quest:', error);
      alert('クエストの作成に失敗しました');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">新規クエスト作成</h1>
      <QuestForm
        initialData={initialQuest}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}