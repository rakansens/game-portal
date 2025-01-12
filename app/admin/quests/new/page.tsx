'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestFormData } from '../../../../src/types/quest';
import { QuestForm } from '../../../../src/components/admin/QuestForm';
import { createQuest } from '../../../../src/lib/admin-api';

const initialQuest: Partial<QuestFormData> = {
  title: '',
  description: '',
  type: 'normal',
  platform: null,
  points: 0,
  status: 'draft',
  difficulty: 1,
  is_important: false,
  is_limited: false,
  estimated_time: null,
  required_points: 0,
  auto_progress: false,
  verification_required: false,
  verification_type: null,
  max_attempts: null,
  cooldown_period: null,
  external_url: null,
  start_date: null,
  end_date: null,
  participants_limit: null,
  banner_url: null,
};

export default function NewQuest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (quest: QuestFormData) => {
    try {
      setLoading(true);
      setError(null);
      await createQuest(quest);
      router.push('/admin');
    } catch (err) {
      console.error('Error creating quest:', err);
      setError(err instanceof Error ? err.message : 'クエストの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">新規クエスト作成</h1>
        <p className="mt-1 text-sm text-gray-600">新しいクエストを作成します。</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <QuestForm
          quest={initialQuest}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          loading={loading}
          submitLabel="作成"
        />
      </div>
    </div>
  );
}