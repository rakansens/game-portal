import { BadgeVariant, BadgeSize } from './types';
import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 transform',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200',
        primary: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200',
        secondary: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200',
        success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200',
        danger: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200',
        warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200',
        info: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200',
        gray: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200',
        indigo: 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-200',
        purple: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200',
        special: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200 shadow-sm hover:shadow',
        limited: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200 shadow-sm hover:shadow',
        exp: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200 shadow-sm hover:shadow',
        points: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200 shadow-sm hover:shadow',
      },
      size: {
        default: 'h-6 px-2.5 text-xs',
        sm: 'h-5 px-2 text-xs',
        lg: 'h-7 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);