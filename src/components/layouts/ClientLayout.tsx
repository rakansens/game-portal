'use client';

import { useEffect, useState } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div 
      className={`min-h-screen w-full bg-background text-[#ddebf0]`}
      data-vsc-initialized={mounted}
    >
      {children}
    </div>
  );
} 