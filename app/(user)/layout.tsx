'use client';

import { UserLayout } from '@/components/user/layout/UserLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserLayout>
      {children}
    </UserLayout>
  );
}