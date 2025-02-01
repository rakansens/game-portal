'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon,
  TrophyIcon,
  PuzzlePieceIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'ダッシュボード',
    href: '/admin',
    icon: HomeIcon,
  },
  {
    name: 'クエスト管理',
    href: '/admin/quests',
    icon: PuzzlePieceIcon,
  },
  {
    name: 'ランキング管理',
    href: '/admin/ranking',
    icon: TrophyIcon,
  },
  {
    name: 'ユーザー管理',
    href: '/admin/users',
    icon: UserGroupIcon,
  },
  {
    name: 'LINE配信',
    href: '/admin/messages',
    icon: ChatBubbleLeftRightIcon,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* サイドバーナビゲーション */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/admin" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
                  管理画面
                </Link>
              </div>
              <div className="mt-8 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-3 flex-shrink-0 h-5 w-5 ${
                            isActive
                              ? 'text-gray-500'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
