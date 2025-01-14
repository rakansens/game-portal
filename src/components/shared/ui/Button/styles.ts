import { ButtonVariant, ButtonSize } from './types';
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 transform shadow-md active:shadow-inner disabled:pointer-events-none disabled:opacity-50 focus:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-gray-950 active:scale-95',
        primary: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95',
        secondary: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 active:scale-95',
        success: 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-95',
        danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:scale-95',
        warning: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 active:scale-95',
        info: 'bg-gradient-to-br from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 active:scale-95',
        destructive: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:scale-95',
        outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-95',
        ghost: 'text-gray-700 hover:bg-gray-100 active:scale-95',
        link: 'text-blue-600 underline-offset-4 hover:underline active:scale-95',
      },
      size: {
        default: 'h-11 px-6 py-2 text-base',
        sm: 'h-9 px-4 py-2 text-sm',
        lg: 'h-13 px-8 py-3 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);