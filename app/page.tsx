'use client';

import { useEffect, useState } from 'react';
import { QuestCard } from '@/components/user/quests/QuestCard';
import { Quest } from '@/types/quest';
import { fetchQuests } from '@/lib/api';

export default function HomePage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        setLoading(true);
        const data = await fetchQuests();
        setQuests(data);
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
    <div className="container mx-auto min-h-screen px-4 py-4">
      <h1 className="mb-6 text-xl font-bold text-gray-900">クエスト一覧</h1>
      
      {/* クエストリスト */}
      <div className="space-y-4">
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onStart={() => {
              // クエスト開始処理
              console.log('Start quest:', quest.id);
            }}
          />
        ))}
      </div>

      {/* クエストが0件の場合 */}
      {quests.length === 0 && (
        <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">現在利用可能なクエストはありません</p>
        </div>
      )}

      {/* 下部ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white py-2">
        <div className="container mx-auto flex justify-around">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <span className="text-xs">クエスト</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <span className="text-xs">ランキング</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <span className="text-xs">報酬</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
