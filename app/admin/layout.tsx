import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { getProfile } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Game Portal',
  description: 'Game Portal Admin Dashboard',
};

async function checkAdminAccess() {
  // TODO: 適切な認証・認可の実装
  // const profile = await getProfile(userId);
  // return profile?.role === 'admin';
  return true; // 開発中は一時的にtrueを返す
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkAdminAccess();
  
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}