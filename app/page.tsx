'use client';

import { useEffect, useState } from 'react';
import { Quest } from '../src/types/supabase';
import { QuestCard } from '../src/components/quest/QuestCard';
import { useAuthStore } from '../src/store/auth';
import { fetchQuests } from '../src/lib/api';

export default function Home() {
  const { user, isLoading: authLoading } = useAuthStore();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchQuests();
        console.log('Fetched quests:', JSON.stringify(data, null, 2));
        setQuests(data);
      } catch (err) {
        console.error('Error loading quests:', err);
        setError('クエストの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadQuests();

      // 24時間ごとに自動更新
      const interval = setInterval(loadQuests, 86400000);
      return () => clearInterval(interval);
    }
  }, [authLoading]);

  // 認証のローディング中のみローディング画面を表示
  if (authLoading) {
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
    // 期間限定クエストの場合：
    // - 開始日が設定されている場合は、終了日前のみ表示
    // - 開始日が設定されていない場合は、終了日前のみ表示
    // - どちらも設定されていない場合は表示
    const isInPeriod = !quest.is_limited || (
      (!startDate || now <= endDate!) &&
      (!endDate || now <= endDate)
    );
    
    // 参加可能人数のチェック
    const hasAvailableSlots = !quest.participants_limit || 
      (quest.participant_count || 0) < quest.participants_limit;

    // デバッグログ
    if (quest.is_limited) {
      console.log('Limited quest:', JSON.stringify({
        id: quest.id,
        title: quest.title,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        now: now.toISOString(),
        isActive,
        isInPeriod,
        hasAvailableSlots,
        is_limited: quest.is_limited,
        start_date: quest.start_date,
        end_date: quest.end_date,
        periodCheck: {
          startCheck: !startDate || now <= endDate!,
          endCheck: !endDate || now <= endDate
        }
      }, null, 2));
    }

    return isActive && isInPeriod && hasAvailableSlots;
  });

  // デバッグログ
  console.log('Active quests:', JSON.stringify(activeQuests, null, 2));

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

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
