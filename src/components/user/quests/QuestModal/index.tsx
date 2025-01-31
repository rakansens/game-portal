'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Quest } from '@/types/quest';
import { cn } from '@/utils/cn';

interface QuestModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  isLoading?: boolean;
}

export function QuestModal({ quest, isOpen, onClose, onStart, isLoading = false }: QuestModalProps) {
  if (!quest) return null;

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
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-t-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all sm:max-w-lg sm:rounded-2xl">
                <div className="space-y-4">
                  {/* ヘッダー */}
                  <div className="space-y-1">
                    <Dialog.Title as="h3" className="text-lg font-bold text-white">
                      {quest.title}
                    </Dialog.Title>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 text-sm text-blue-400">
                        {quest.type === 'normal' ? 'ノーマル' : quest.type === 'special' ? 'スペシャル' : '期間限定'}
                      </span>
                      {quest.is_important && (
                        <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-sm text-yellow-400">
                          重要
                        </span>
                      )}
                      {quest.exp_reward > 0 && (
                        <span className="rounded bg-green-500/20 px-2 py-0.5 text-sm text-green-400">
                          EXP +{quest.exp_reward}
                        </span>
                      )}
                      {quest.points && quest.points > 0 && (
                        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-sm text-purple-400">
                          {quest.points}ポイント
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 説明 */}
                  <p className="text-sm text-gray-300">{quest.description}</p>

                  {/* 詳細情報 */}
                  <div className="space-y-2 rounded-lg bg-gray-700/50 p-4 text-sm">
                    {quest.estimated_time && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">推定所要時間</span>
                        <span className="text-white">{quest.estimated_time}分</span>
                      </div>
                    )}
                    {quest.required_points && quest.required_points > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">必要ポイント</span>
                        <span className="text-white">{quest.required_points}ポイント</span>
                      </div>
                    )}
                    {quest.max_attempts && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">挑戦可能回数</span>
                        <span className="text-white">{quest.max_attempts}回</span>
                      </div>
                    )}
                    {quest.cooldown_period && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">クールダウン期間</span>
                        <span className="text-white">{quest.cooldown_period}分</span>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onStart}
                      disabled={isLoading}
                      className={cn(
                        "w-full rounded-lg bg-blue-500 px-4 py-3 text-center font-bold text-white transition-colors",
                        isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
                      )}
                    >
                      {isLoading ? "読み込み中..." : "クエストを開始"}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="w-full rounded-lg px-4 py-3 text-center font-bold text-gray-400 transition-colors hover:bg-gray-700/50"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
