'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 py-2">
      <div className="container mx-auto flex justify-around">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center p-2 transition-colors",
            pathname === '/' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
          )}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="mt-1 text-xs">クエスト</span>
        </Link>
        <Link
          href="/ranking"
          className={cn(
            "flex flex-col items-center p-2 transition-colors",
            pathname === '/ranking' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
          )}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="mt-1 text-xs">ランキング</span>
        </Link>
        <Link
          href="/rewards"
          className={cn(
            "flex flex-col items-center p-2 transition-colors",
            pathname === '/rewards' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
          )}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <span className="mt-1 text-xs">報酬</span>
        </Link>
      </div>
    </nav>
  );
}
