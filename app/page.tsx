'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    <div className="container mx-auto min-h-screen px-4 pb-20 pt-4">
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
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 py-2">
        <div className="container mx-auto flex justify-around">
          <Link href="/" className="flex flex-col items-center p-2 text-blue-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="mt-1 text-xs">クエスト</span>
          </Link>
          <Link href="/ranking" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="mt-1 text-xs">ランキング</span>
          </Link>
          <Link href="/rewards" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="mt-1 text-xs">報酬</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
