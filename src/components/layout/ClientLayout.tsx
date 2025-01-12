'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';
import { LiffProvider } from '../providers/LiffProvider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // 管理者ページの場合はLiffProviderをスキップ
  if (isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <LiffProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
        <Footer />
      </div>
    </LiffProvider>
  );
}