'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { LiffProvider } from '../src/components/providers/LiffProvider';
import { Footer } from '../src/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Game Portal',
  description: 'LINE LIFF Game Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50`}>
        <LiffProvider>
          <main className={isAdmin ? '' : 'pb-20'}>
            {children}
          </main>
          {!isAdmin && <Footer />}
        </LiffProvider>
      </body>
    </html>
  );
}
