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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* サイドバー */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
          </div>
          <nav className="mt-6 px-4">
            <div className="space-y-4">
              <a
                href="/admin"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                クエスト管理
              </a>
              <a
                href="/admin/users"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
              >
                <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                ユーザー管理
              </a>
              <a
                href="/admin/stats"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
              >
                <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                統計情報
              </a>
            </div>
          </nav>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 pl-64">
          <header className="bg-white shadow-sm">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">管理画面</h1>
                <button className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                  ログアウト
                </button>
              </div>
            </div>
          </header>

          <main className="px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}