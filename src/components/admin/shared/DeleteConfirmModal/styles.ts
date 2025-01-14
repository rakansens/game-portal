import { cva } from 'class-variance-authority';

export const overlayStyles = 'fixed inset-0 bg-black bg-opacity-50 transition-opacity';

export const modalContainerStyles = 'fixed inset-0 z-10 overflow-y-auto';

export const modalContentWrapperStyles = 'flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0';

export const modalContentStyles = 'relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6';

export const iconContainerStyles = 'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100';

export const iconStyles = 'h-6 w-6 text-red-600';

export const titleStyles = 'mt-3 text-center sm:mt-5';

export const titleTextStyles = 'text-lg font-medium leading-6 text-gray-900';

export const buttonContainerStyles = 'mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3';