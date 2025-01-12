'use client';

import { usePathname } from 'next/navigation';
import { LiffProvider } from '../providers/LiffProvider';
import { Footer } from './Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <LiffProvider>
      <main className={isAdmin ? '' : 'pb-20'}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </LiffProvider>
  );
}