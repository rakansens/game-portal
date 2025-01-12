'use client';

import { QuestCard } from '../src/components/quest/QuestCard';
import { useAuthStore } from '../src/store/auth';
import { Quest } from '../src/types/liff';

// ダミーデータ
const dummyQuests: Quest[] = [
  {
    id: '1',
    title: '初心者向けクエスト',
    description: 'ゲームポータルの基本的な機能を学ぶクエストです。',
    difficulty: 1,
    reward: 100,
    category: 'チュートリアル',
    tags: ['初心者向け', '基本'],
    isPublished: true,
  },
  {
    id: '2',
    title: '中級者チャレンジ',
    description: 'より高度な課題に挑戦するクエストです。',
    difficulty: 3,
    reward: 300,
    category: 'チャレンジ',
    tags: ['中級者向け', '技術'],
    isPublished: true,
  },
  {
    id: '3',
    title: '上級者ミッション',
    description: '最も難しい課題に挑戦する上級者向けクエストです。',
    difficulty: 5,
    reward: 500,
    category: 'ミッション',
    tags: ['上級者向け', '挑戦'],
    isPublished: true,
  },
];

export default function Home() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return null; // LiffProviderのローディング表示に任せる
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ようこそ、{user?.displayName || 'ゲスト'}さん
        </h1>
        <p className="mt-2 text-gray-600">
          利用可能なクエスト一覧です。興味のあるクエストに参加してみましょう！
        </p>
      </div>

      {/* クエスト一覧 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>

      {/* 空の状態 */}
      {dummyQuests.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600">
            現在利用可能なクエストはありません。
            <br />
            また後でチェックしてください。
          </p>
        </div>
      )}
    </main>
  );
}
