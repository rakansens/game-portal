'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Footer } from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { user, isLoading, initializeAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}

export default ClientLayout;