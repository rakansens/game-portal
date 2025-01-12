import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50`}>
        <LiffProvider>
          <main className="container mx-auto max-w-md pb-20">
            {children}
          </main>
          <Footer />
        </LiffProvider>
      </body>
    </html>
  );
}
