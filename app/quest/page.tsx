'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/shared/navigation/BottomNav';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/solid';

import { PublicQuest } from '@/types/quest';

export default function QuestPage() {
  const [quests, setQuests] = useState<PublicQuest[]>([]);
  const [coins, setCoins] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuests() {
      try {
        const response = await fetch('/api/quests');
        if (!response.ok) throw new Error('Failed to fetch quests');
        const data = await response.json();
        setQuests(data);
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
      setLoading(false);
    }
    fetchQuests();
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 bg-pattern">
      {/* ヘッダー */}
      <div className="relative flex items-center justify-between p-4">
        <button className="rounded-full bg-white/10 p-3 backdrop-blur-sm shadow-lg hover:bg-white/20 transition">
          <ArrowLeftIcon className="h-7 w-7 text-white" />
        </button>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-3 rounded-full bg-purple-500/50 px-5 py-2 backdrop-blur-sm shadow-lg">
            <span className="text-2xl text-yellow-400">🪙</span>
            <span className="font-gaming text-2xl text-white">{coins}</span>
            <button className="rounded-full bg-blue-500 p-2 hover:bg-blue-400 transition shadow-md">
              <PlusIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* タイトル */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl bg-purple-500/50 px-8 py-4 backdrop-blur-sm shadow-lg">
          <span className="text-3xl">📋</span>
          <h1 className="font-gaming text-3xl text-white tracking-wider">MISSIONS</h1>
        </div>
      </div>

      {/* ミッションリスト */}
      <div className="px-4 pb-24">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-white">読み込み中...</div>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {quests.map((quest, index) => (
              <motion.div
                key={quest.id}
                className="overflow-hidden rounded-xl bg-purple-500/50 backdrop-blur-sm shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* アイコン */}
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-400/50 text-3xl shadow-inner"
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {quest.category === 'game' ? '🎮' :
                     quest.category === 'social' ? '👥' :
                     quest.category === 'achievement' ? '🏆' : '📋'}
                  </motion.div>

                  {/* タイトルと説明 */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-gaming text-xl text-white">{quest.title}</h3>
                      {quest.is_important && (
                        <span className="text-yellow-400 text-sm">⭐️</span>
                      )}
                    </div>
                    <p className="text-sm text-purple-200/80">{quest.description}</p>
                    {/* 難易度と経験値 */}
                    <div className="mt-1 flex items-center gap-3 text-xs text-purple-200">
                      <span>難易度: {'⭐️'.repeat(quest.difficulty)}</span>
                      <span>EXP: {quest.exp_reward}</span>
                    </div>
                    {/* プログレスバー */}
                    <div className="mt-2">
                      <div className="h-3 overflow-hidden rounded-full bg-purple-700/50">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-300 to-purple-200"
                          initial={{ width: 0 }}
                          animate={{ width: quest.progress_status === 'completed' ? '100%' : '0%' }}
                          whileHover={{
                            scale: [1, 1.02, 1],
                            transition: { duration: 1, repeat: Infinity }
                          }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-purple-200">
                        {quest.progress_status === 'completed' ? '完了' :
                         quest.progress_status === 'in_progress' ? '進行中' : '未開始'}
                      </div>
                    </div>
                  </div>

                  {/* ポイントとボタン */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xl text-yellow-400">🪙</span>
                      <span className="font-gaming text-lg text-white">{quest.points || 0}</span>
                    </div>
                    <motion.button
                      className="rounded-lg bg-yellow-400 px-6 py-2 font-gaming text-sm text-yellow-900 shadow-lg"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: '#FCD34D',
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!quest.is_available}
                    >
                      {quest.progress_status === 'completed' ? 'DONE' : 'GET'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* フッター */}
      <BottomNav />
    </div>
  );
}
