'use client';

import { useEffect, useState } from 'react';
import { PublicQuest } from '@/types/quest';
import { QuestCard } from '@/components/user/quests/QuestCard';
import { useAuthStore } from '@/store/auth';
import { fetchPublicQuests } from '@/features/quests/actions';
import { toPublicQuest } from '@/types/quest';

export default function HomePage() {
  const [quests, setQuests] = useState<PublicQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadQuests = async () => {
      try {
        setLoading(true);
        const result = await fetchPublicQuests();
        if (result.error) {
          throw new Error(result.error);
        }
        if (result.data) {
          const publicQuests = result.data.map(quest => 
            toPublicQuest(quest, true)
          );
          setQuests(publicQuests);
        }
      } catch (err) {
        setError('クエストの読み込みに失敗しました');
        console.error('Error loading quests:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">クエスト一覧</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}
