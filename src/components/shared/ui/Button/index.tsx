'use client';

import { ButtonProps } from './types';
import { buttonVariants } from './styles';
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
        'group relative inline-flex items-center justify-center font-bold transition-all duration-300',
        'before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-300',
        'after:absolute after:inset-0 after:rounded-xl after:transition-all after:duration-300',
        variant === 'primary' && [
          'text-[#ddebf0] hover:text-white',
          'before:bg-[#2761c3] before:opacity-100 hover:before:opacity-0',
          'after:bg-[#27c39f] after:opacity-0 hover:after:opacity-100',
          'before:clip-corners after:clip-corners',
          'before:transform before:transition-transform hover:before:scale-[1.02]',
          'after:transform after:transition-transform hover:after:scale-[1.02]',
        ],
        variant === 'success' && [
          'text-[#ddebf0] hover:text-white',
          'before:bg-[#27c39f] before:opacity-100 hover:before:opacity-0',
          'after:bg-[#2761c3] after:opacity-0 hover:after:opacity-100',
          'before:clip-corners after:clip-corners',
          'before:transform before:transition-transform hover:before:scale-[1.02]',
          'after:transform after:transition-transform hover:after:scale-[1.02]',
        ],
        size === 'default' && 'h-12 px-6 py-3',
        size === 'sm' && 'h-9 px-4 py-2 text-sm',
        size === 'lg' && 'h-14 px-8 py-4 text-lg',
        fullWidth && 'w-full',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      disabled={disabled || isLoading || loading}
      {...props}
    >
      <span className="relative z-10">
        {(isLoading || loading) && (
          <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </span>
      <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 bg-current opacity-0 transition-all group-hover:opacity-100" />
      <div className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 bg-current opacity-0 transition-all group-hover:opacity-100" />
    </button>
  );
}