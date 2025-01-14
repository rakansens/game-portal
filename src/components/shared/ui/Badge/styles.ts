import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        secondary: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        danger: 'bg-red-100 text-red-800 hover:bg-red-200',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        info: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
        gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        indigo: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
        purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      },
      size: {
        default: 'px-2.5 py-0.5 text-sm',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);