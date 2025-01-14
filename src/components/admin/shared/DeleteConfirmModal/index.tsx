'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/admin/ui/Button';
import { DeleteConfirmModalProps } from './types';
import {
  overlayStyles,
  modalContainerStyles,
  modalContentWrapperStyles,
  modalContentStyles,
  iconContainerStyles,
  iconStyles,
  titleStyles,
  titleTextStyles,
  buttonContainerStyles,
} from './styles';

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteConfirmModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className={overlayStyles} />
        </Transition.Child>

        <div className={modalContainerStyles}>
          <div className={modalContentWrapperStyles}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={modalContentStyles}>
                <div>
                  <div className={iconContainerStyles}>
                    <ExclamationTriangleIcon
                      className={iconStyles}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={titleStyles}>
                    <Dialog.Title className={titleTextStyles}>
                      {title}を削除しますか？
                    </Dialog.Title>
                  </div>
                </div>
                <div className={buttonContainerStyles}>
                  <Button
                    variant="danger"
                    onClick={onConfirm}
                  >
                    削除
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    キャンセル
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}