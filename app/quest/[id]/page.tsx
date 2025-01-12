'use client';

import { use } from 'react';
import { useAuthStore } from '../../../src/store/auth';
import { Quest } from '../../../src/types/liff';
import Link from 'next/link';

// ダミーデータ（後でAPIから取得するように変更）
const getDummyQuest = (id: string): Quest | null => {
  const dummyQuests: Record<string, Quest> = {
    '1': {
      id: '1',
      title: '初心者向けクエスト',
      description: 'ゲームポータルの基本的な機能を学ぶクエストです。詳細な説明や達成条件などがここに表示されます。',
      difficulty: 1,
      reward: 100,
      category: 'チュートリアル',
      tags: ['初心者向け', '基本'],
      isPublished: true,
    },
    '2': {
      id: '2',
      title: '中級者チャレンジ',
      description: 'より高度な課題に挑戦するクエストです。',
      difficulty: 3,
      reward: 300,
      category: 'チャレンジ',
      tags: ['中級者向け', '技術'],
      isPublished: true,
    },
    '3': {
      id: '3',
      title: '上級者ミッション',
      description: '最も難しい課題に挑戦する上級者向けクエストです。',
      difficulty: 5,
      reward: 500,
      category: 'ミッション',
      tags: ['上級者向け', '挑戦'],
      isPublished: true,
    },
  };

  return dummyQuests[id] || null;
};

export default function QuestDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user, isLoading } = useAuthStore();
  const quest = getDummyQuest(resolvedParams.id);

  if (isLoading) {
    return null;
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
              {[...Array(5)].map((_, i) => (
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
            <p className="mt-2 text-2xl font-bold text-green-600">{quest.reward} pt</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">タグ</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {quest.tags.map((tag) => (
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
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => {
            // TODO: クエスト参加処理の実装
            alert('クエストに参加しました！');
          }}
        >
          クエストに参加する
        </button>
      </div>
    </div>
  );
}
