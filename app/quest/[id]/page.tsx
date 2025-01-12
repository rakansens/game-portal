'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../src/store/auth';
import { Quest } from '../../../src/types/supabase';
import { getQuestById, startQuest } from '../../../src/lib/supabase';
import Link from 'next/link';

interface PageProps {
  params: {
    id: string;
  };
}

export default function QuestDetail({ params }: PageProps): React.ReactElement {
  const { user } = useAuthStore();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchQuest = async () => {
      if (!params.id) return;

      try {
        const data = await getQuestById(params.id);
        if (!data) {
          setError('クエストが見つかりません');
          return;
        }
        setQuest(data);
      } catch (err) {
        setError('クエストの取得に失敗しました');
        console.error('Error fetching quest:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuest();
  }, [params.id]);

  const handleJoinQuest = async () => {
    if (!user || !quest) {
      alert('クエストに参加するにはログインが必要です');
      return;
    }

    setJoining(true);
    try {
      const result = await startQuest(user.id, quest.id);
      if (result) {
        alert('クエストに参加しました！');
      } else {
        throw new Error('クエスト参加に失敗しました');
      }
    } catch (err) {
      console.error('Error joining quest:', err);
      alert('クエスト参加に失敗しました。もう一度お試しください。');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">クエストが見つかりません</h1>
          <p className="mt-2 text-gray-600">
            指定されたクエストは存在しないか、削除された可能性があります。
          </p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← トップページに戻る
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{quest.title}</h1>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              {quest.category}
            </span>
          </div>
          <p className="mt-4 text-gray-600">{quest.description}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="text-lg font-semibold text-gray-900">難易度</h2>
            <div className="mt-2 flex">
              {[...Array(5)].map((_: unknown, i: number) => (
                <svg
                  key={i}
                  className={`h-6 w-6 ${
                    i < quest.difficulty ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="text-lg font-semibold text-gray-900">報酬</h2>
            <p className="mt-2 text-2xl font-bold text-green-600">{quest.exp_reward} EXP</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">タグ</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {quest.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          className={`w-full rounded-lg px-4 py-2 text-white ${
            joining
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleJoinQuest}
          disabled={joining}
        >
          {joining ? '参加処理中...' : 'クエストに参加する'}
        </button>
      </div>
    </div>
  );
}
