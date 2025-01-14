'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

export function Footer() {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'EARN',
      href: '/',
      active: pathname === '/',
    },
    {
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      label: 'GAMES',
      href: '/games',
      active: pathname === '/games',
    },
    {
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      label: 'RANKING',
      href: '/ranking',
      active: pathname === '/ranking',
    },
    {
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      label: 'TREASURE',
      href: '/treasure',
      active: pathname === '/treasure',
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#070809]">
      {/* グラデーションボーダー */}
      <div className="h-px w-full bg-gradient-to-r from-[#2761c3] via-[#27c39f] to-[#2761c3] opacity-20" />
      
      {/* メインコンテンツ */}
      <nav className="bg-[#070809] border-t border-[#2761c3]/10">
        <div className="mx-auto max-w-[280px] px-2">
          <div className="flex h-14 items-center justify-around">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex flex-col items-center gap-0.5 transition-all duration-300',
                  'relative px-2 py-1',
                  'hover:text-[#27c39f]',
                  item.active ? 'text-[#27c39f]' : 'text-[#ddebf0]/60'
                )}
              >
                {/* アイコン */}
                <div className="relative">
                  {item.icon}
                  <div className="absolute inset-0 rounded-full bg-current opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20" />
                </div>

                {/* ラベル */}
                <span className="text-[9px] font-bold tracking-wider">{item.label}</span>

                {/* アクティブインジケーター */}
                {item.active && (
                  <div className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#2761c3] via-[#27c39f] to-[#2761c3] shadow-[0_0_10px_rgba(39,193,159,0.5)]" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </footer>
  );
}