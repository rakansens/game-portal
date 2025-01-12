import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getProfile } from '../../src/lib/supabase';

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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkAdminAccess();
  
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}