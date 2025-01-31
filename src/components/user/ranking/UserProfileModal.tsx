import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserRanking } from '@/types/ranking';
import { Badge } from '@/components/user/ui/Badge';

interface UserProfileModalProps {
  user: UserRanking;
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
  // 仮のバッジデータ（後でAPIから取得）
  const badges = [
    { id: 1, name: "クエストマスター", description: "100個のクエストを完了", icon: "🏆" },
    { id: 2, name: "スピードスター", description: "クエストを30分以内に完了", icon: "⚡" },
    { id: 3, name: "パーフェクショニスト", description: "全ての課題で満点を獲得", icon: "✨" },
  ];

  // 仮の統計データ（後でAPIから取得）
  const stats = [
    { label: "完了クエスト", value: user.quest_completed },
    { label: "総獲得ポイント", value: user.points },
    { label: "平均スコア", value: "95.5" },
    { label: "連続達成日数", value: "7" },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800/90 p-6 backdrop-blur-sm transition-all">
                {/* ヘッダー部分 */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-[#2761c3]/30">
                      <Image
                        src={user.avatar_url}
                        alt={user.username}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2761c3] to-[#27c39f] text-white font-bold shadow-lg">
                      {user.rank}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-[#2761c3]/20 px-3 py-1 text-[#27c39f]">
                        Lv.{user.level}
                      </span>
                      <span className="text-[#ddebf0]/60">
                        ランク #{user.rank}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-[#2761c3]/10 p-4 backdrop-blur-sm
                        hover:bg-[#2761c3]/20 transition-all duration-300
                        hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      <div className="text-[#ddebf0]/60 text-sm mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* 獲得バッジ */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">獲得バッジ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-4 rounded-xl bg-[#2761c3]/10 p-4 backdrop-blur-sm
                          hover:bg-[#2761c3]/20 transition-all duration-300"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2761c3] to-[#27c39f] text-2xl">
                          {badge.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{badge.name}</div>
                          <div className="text-sm text-[#ddebf0]/60">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 閉じるボタン */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
