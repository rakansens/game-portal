'use client';

import { Footer } from '@/components/shared/layout/Footer';

export function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 背景のアニメーション効果 */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(39,97,195,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(39,193,159,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer pointer-events-none" style={{ animationDelay: '0.5s' }} />
      
      {/* グリッドパターン */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMEwyMCA0ME00MCAwTDQwIDQwTTAgMEwwIDQwTTAgMjBMNDAgMjAiIHN0cm9rZT0icmdiYSgzOSw5NywxOTUsMC4wNSkiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

      {/* メインコンテンツ */}
      <main className="relative min-h-screen pb-20">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}