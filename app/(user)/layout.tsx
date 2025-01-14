'use client';

import { ClientLayout } from '@/components/shared/layout/ClientLayout';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}