'use client';

import { useEffect, useState } from 'react';
import { Game } from '@/types/game';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { GameCard } from '@/components/user/games/GameCard';
import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const featuredContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        // 通常のゲーム一覧を取得
        const { data: normalGames, error: normalError } = await supabase
          .from('games')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        // おすすめゲームを取得（例：最新の3件）
        const { data: featured, error: featuredError } = await supabase
          .from('games')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);

        if (normalError) throw normalError;
        if (featuredError) throw featuredError;

        setGames(normalGames || []);
        setFeaturedGames(featured || []);
      } catch (err) {
        setError('ゲームの読み込みに失敗しました');
        console.error('Error loading games:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  // 自動スライド
  useEffect(() => {
    if (featuredGames.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => 
        prev === featuredGames.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredGames.length]);

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
      {/* おすすめゲーム */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center text-lg font-bold text-white">
          <span className="mr-2 inline-block h-4 w-1 bg-blue-400"></span>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            おすすめゲーム
          </span>
        </h2>
        <div className="relative overflow-hidden">
          <motion.div
            ref={featuredContainerRef}
            className="flex touch-pan-y"
            drag="x"
            dragConstraints={{ left: -(featuredGames.length - 1) * 100, right: 0 }}
            dragElastic={0.2}
            animate={{ x: -currentFeaturedIndex * 100 + '%' }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {featuredGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="w-full flex-none px-2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: currentFeaturedIndex === index ? 1 : 0.9,
                  opacity: currentFeaturedIndex === index ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
              >
                <GameCard game={game} featured />
              </motion.div>
            ))}
          </motion.div>

          {/* インジケーター */}
          <div className="mt-4 flex justify-center gap-2">
            {featuredGames.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  currentFeaturedIndex === index
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
                onClick={() => setCurrentFeaturedIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 全てのゲーム */}
      <section>
        <h2 className="mb-4 flex items-center text-lg font-bold text-white">
          <span className="mr-2 inline-block h-4 w-1 bg-blue-400"></span>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            全てのゲーム
          </span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>

        {/* ゲームが0件の場合 */}
        {games.length === 0 && (
          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600">現在利用可能なゲームはありません</p>
          </div>
        )}
      </section>

      {/* 下部ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 py-3">
        <div className="container mx-auto flex justify-around">
          <Link href="/" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="mt-1 text-sm">クエスト</span>
          </Link>
          <Link href="/games" className="flex flex-col items-center p-2 text-blue-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="mt-1 text-sm">ゲーム</span>
          </Link>
          <Link href="/ranking" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="mt-1 text-sm">ランキング</span>
          </Link>
        </div>
      </nav>
    </div>
  );
} 