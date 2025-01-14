'use client';

import { cn } from '@/utils/cn';
import { BadgeProps } from './types';

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center transition-all duration-300',
        'rounded-full backdrop-blur-sm',
        'border-2 shadow-lg',
        'relative overflow-hidden',
        'before:absolute before:inset-0 before:transition-opacity before:duration-300',
        'after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] after:bg-[length:250%_250%] after:animate-shimmer',
        'hover:scale-105 hover:shadow-xl',
        variant === 'default' && [
          'bg-[#2761c3]/10 border-[#2761c3]/30 text-[#ddebf0]',
          'before:bg-gradient-to-r before:from-[#2761c3]/0 before:via-[#2761c3]/10 before:to-[#2761c3]/0',
          'hover:border-[#2761c3]/50 hover:text-white',
          'hover:shadow-[0_0_15px_rgba(39,97,195,0.3)]',
        ],
        variant === 'special' && [
          'bg-[#27c39f]/10 border-[#27c39f]/30 text-[#27c39f]',
          'before:bg-gradient-to-r before:from-[#27c39f]/0 before:via-[#27c39f]/10 before:to-[#27c39f]/0',
          'hover:border-[#27c39f]/50 hover:text-[#4febc7]',
          'hover:shadow-[0_0_15px_rgba(39,193,159,0.3)]',
        ],
        variant === 'limited' && [
          'bg-[#c32761]/10 border-[#c32761]/30 text-[#ffb8d9]',
          'before:bg-gradient-to-r before:from-[#c32761]/0 before:via-[#c32761]/10 before:to-[#c32761]/0',
          'hover:border-[#c32761]/50 hover:text-[#ffd1e6]',
          'hover:shadow-[0_0_15px_rgba(195,39,97,0.3)]',
        ],
        variant === 'exp' && [
          'bg-[#27c361]/10 border-[#27c361]/30 text-[#27c361]',
          'before:bg-gradient-to-r before:from-[#27c361]/0 before:via-[#27c361]/10 before:to-[#27c361]/0',
          'hover:border-[#27c361]/50 hover:text-[#4feb85]',
          'hover:shadow-[0_0_15px_rgba(39,195,97,0.3)]',
          'animate-pulse-slow',
        ],
        variant === 'points' && [
          'bg-[#c3a727]/10 border-[#c3a727]/30 text-[#c3a727]',
          'before:bg-gradient-to-r before:from-[#c3a727]/0 before:via-[#c3a727]/10 before:to-[#c3a727]/0',
          'hover:border-[#c3a727]/50 hover:text-[#ebcf4f]',
          'hover:shadow-[0_0_15px_rgba(195,167,39,0.3)]',
          'animate-pulse-slow',
        ],
        size === 'default' && 'px-3 py-1 text-sm',
        size === 'sm' && 'px-2.5 py-0.5 text-xs',
        size === 'lg' && 'px-4 py-1.5 text-base',
        className
      )}
      {...props}
    >
      {/* 内部コンテンツ */}
      <span className="relative z-10">{children}</span>

      {/* 装飾的な要素 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine" style={{ animationDelay: '0.2s' }} />

      {/* グロー効果 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-0 blur-lg transition-opacity duration-300 hover:opacity-20" />
    </span>
  );
}