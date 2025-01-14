'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quest } from '@/types/quest';
import { EditQuestForm } from './components/EditQuestForm';
import { fetchQuestById } from '@/lib/admin-api';

interface EditQuestPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditQuestPage({ params }: EditQuestPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/quests?id=${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch quest');
        }

        setQuest(data);
      } catch (err) {
        setError('クエストの読み込みに失敗しました');
        console.error('Error loading quest:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuest();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center text-red-600">
          <p>クエストが見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">クエストの編集</h1>
      <EditQuestForm quest={quest} />
    </div>
  );
}