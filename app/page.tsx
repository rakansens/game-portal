'use client';

import { useEffect, useState } from 'react';
import { Quest } from '../src/types/supabase';
import { QuestCard } from '../src/components/quest/QuestCard';
import { useAuthStore } from '../src/store/auth';
import { fetchQuests } from '../src/lib/api';

export default function Home() {
  const { user, isLoading: authLoading } = useAuthStore();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchQuests();
        setQuests(data);
      } catch (err) {
        console.error('Error loading quests:', err);
        setError('クエストの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadQuests();

    // 1分ごとに自動更新
    const interval = setInterval(loadQuests, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-md px-4 py-6">
        <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const activeQuests = quests.filter(quest => {
    const now = new Date();
    const startDate = quest.start_date ? new Date(quest.start_date) : null;
    const endDate = quest.end_date ? new Date(quest.end_date) : null;
    
    // アクティブ状態のチェック
    const isActive = quest.status === 'active';
    
    // 期間のチェック
    const isInPeriod = !quest.is_limited || (
      (!startDate || startDate <= now) &&
      (!endDate || endDate >= now)
    );
    
    // 参加可能人数のチェック
    const hasAvailableSlots = !quest.participants_limit || 
      (quest.participant_count || 0) < quest.participants_limit;

    return isActive && isInPeriod && hasAvailableSlots;
  });

  return (
    <div className="container mx-auto max-w-md px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          ようこそ、{user?.displayName || 'ゲスト'}さん
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          利用可能なクエスト一覧です。興味のあるクエストに参加してみましょう！
        </p>
      </div>

      <div className="space-y-4">
        {activeQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
        {activeQuests.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-600">
              現在利用可能なクエストはありません。
              <br />
              また後でチェックしてください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
