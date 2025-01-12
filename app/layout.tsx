import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientLayout } from '../src/components/layout/ClientLayout';

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
