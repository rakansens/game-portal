import { cva } from 'class-variance-authority';

export const checkboxContainerStyles = 'flex items-start';

export const checkboxWrapperStyles = 'flex h-5 items-center';

export const checkboxStyles = cva(
  [
    'h-4 w-4 rounded border-gray-300 text-blue-600',
    'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ],
  {
    variants: {
      error: {
        true: 'border-red-300 focus:ring-red-500',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
);

export const labelContainerStyles = 'ml-3';

export const labelStyles = cva('text-sm font-medium', {
  variants: {
    error: {
      true: 'text-red-600',
      false: 'text-gray-700',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
  },
});

export const helperTextStyles = cva('text-sm', {
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