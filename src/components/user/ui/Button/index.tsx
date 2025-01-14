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
        'group relative inline-flex items-center justify-center font-bold transition-all duration-300',
        'rounded-2xl overflow-hidden',
        'before:absolute before:inset-0 before:transition-all before:duration-300',
        'after:absolute after:inset-0 after:transition-all after:duration-300',
        variant === 'primary' && [
          'text-[#ddebf0] hover:text-white',
          'before:bg-user-primary before:opacity-100 hover:before:opacity-0',
          'after:bg-user-primary-hover after:opacity-0 hover:after:opacity-100',
          'before:transform before:transition-transform hover:before:scale-[1.02]',
          'after:transform after:transition-transform hover:after:scale-[1.02]',
          'shadow-[0_0_15px_rgba(39,97,195,0.3)] hover:shadow-[0_0_25px_rgba(39,193,159,0.5)]',
          'border-2 border-user-primary hover:border-user-primary-hover',
          'relative overflow-hidden',
          'after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] after:bg-[length:250%_250%] after:animate-shimmer',
        ],
        variant === 'success' && [
          'text-[#ddebf0] hover:text-white',
          'before:bg-[#27c39f] before:opacity-100 hover:before:opacity-0',
          'after:bg-user-primary after:opacity-0 hover:after:opacity-100',
          'before:transform before:transition-transform hover:before:scale-[1.02]',
          'after:transform after:transition-transform hover:after:scale-[1.02]',
          'shadow-[0_0_15px_rgba(39,193,159,0.3)] hover:shadow-[0_0_25px_rgba(39,97,195,0.5)]',
          'border-2 border-[#27c39f] hover:border-user-primary',
          'relative overflow-hidden',
          'after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] after:bg-[length:250%_250%] after:animate-shimmer',
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
      <span className="relative z-10 flex items-center justify-center gap-2">
        {(isLoading || loading) && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        <span className="text-shadow-neon tracking-wider group-hover:text-shadow-neon-strong transition-all duration-300">{children}</span>
        <svg
          className="h-5 w-5 transform transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </span>

      {/* 装飾的な要素 */}
      <div className="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-current opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
      <div className="absolute -right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-current opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-x-1" />
      
      {/* シャインエフェクト */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine" style={{ animationDelay: '0.2s' }} />
      
      {/* グラデーションボーダー */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-user-primary via-user-primary-hover to-user-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

      {/* グロー効果 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-current to-transparent opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20" />
    </button>
  );
}