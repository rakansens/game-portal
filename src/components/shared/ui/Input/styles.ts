import { cva } from 'class-variance-authority';

export const inputContainerStyles = 'w-full';

export const labelStyles = 'mb-1.5 block text-sm font-medium text-gray-700';

export const inputStyles = cva(
  [
    'block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'text-gray-900 placeholder-gray-500', // テキストの色を追加
  ],
  {
    variants: {
      error: {
        true: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        false: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      },
      disabled: {
        true: 'cursor-not-allowed bg-gray-50 opacity-50',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
);

export const helperTextStyles = cva('mt-1 text-sm', {
  variants: {
    error: {
      true: 'text-red-600',
      false: 'text-gray-500',
    },
  },
  defaultVariants: {
    error: false,
  },
});