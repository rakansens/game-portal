'use client';

import { ButtonProps } from './types';
import { cn } from '@/utils/cn';

export function Button({
  children,
  className,
  variant = 'default',
  size = 'default',
  isLoading,
  loading,
  disabled,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-200',
        'rounded-md',
        variant === 'primary' && [
          'bg-admin-primary text-white hover:bg-admin-primary-hover',
          'shadow-sm',
        ],
        variant === 'secondary' && [
          'bg-gray-100 text-gray-900 hover:bg-gray-200',
          'border border-gray-300',
        ],
        variant === 'success' && [
          'bg-green-600 text-white hover:bg-green-700',
          'shadow-sm',
        ],
        variant === 'danger' && [
          'bg-red-600 text-white hover:bg-red-700',
          'shadow-sm',
        ],
        variant === 'warning' && [
          'bg-yellow-500 text-white hover:bg-yellow-600',
          'shadow-sm',
        ],
        variant === 'outline' && [
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        ],
        variant === 'ghost' && [
          'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        ],
        size === 'default' && 'h-10 px-4 py-2',
        size === 'sm' && 'h-8 px-3 py-1 text-sm',
        size === 'lg' && 'h-12 px-6 py-3 text-lg',
        fullWidth && 'w-full',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      disabled={disabled || isLoading || loading}
      {...props}
    >
      {(isLoading || loading) && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}