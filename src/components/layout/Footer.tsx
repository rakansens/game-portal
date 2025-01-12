'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="container mx-auto flex h-14 max-w-md items-center justify-around px-4">
        <Link
          href="/"
          className={`flex flex-1 flex-col items-center justify-center ${
            pathname === '/'
              ? 'text-blue-600'
              : 'text-gray-600 active:text-blue-600'
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="mt-0.5 text-xs font-medium">EARN</span>
        </Link>

        <Link 
          href="/games"
          className={`flex flex-1 flex-col items-center justify-center ${
            pathname === '/games'
              ? 'text-blue-600'
              : 'text-gray-600 active:text-blue-600'
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span className="mt-0.5 text-xs font-medium">GAMES</span>
        </Link>

        <Link 
          href="/ranking"
          className={`flex flex-1 flex-col items-center justify-center ${
            pathname === '/ranking'
              ? 'text-blue-600'
              : 'text-gray-600 active:text-blue-600'
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="mt-0.5 text-xs font-medium">RANKING</span>
        </Link>

        <Link 
          href="/treasure"
          className={`flex flex-1 flex-col items-center justify-center ${
            pathname === '/treasure'
              ? 'text-blue-600'
              : 'text-gray-600 active:text-blue-600'
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="mt-0.5 text-xs font-medium">TREASURE</span>
        </Link>
      </nav>
    </footer>
  );
}