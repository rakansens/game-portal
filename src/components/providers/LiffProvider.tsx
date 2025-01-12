'use client';

import { useEffect } from 'react';
import { initializeLiff } from '../../lib/liff';
import { useAuthStore } from '../../store/auth';

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = useAuthStore();

  useEffect(() => {
    initializeLiff();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
