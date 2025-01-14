import React from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant = 'default' | 'special' | 'limited' | 'exp' | 'points' | 'featured' | 'new';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'lg';
}

export function Badge({ variant = 'default', size = 'sm', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        // サイズバリエーション
        size === 'sm' && 'px-2.5 py-0.5 text-xs',
        size === 'lg' && 'px-3 py-1 text-sm',
        // カラーバリエーション
        variant === 'default' && 'bg-blue-100 text-blue-800',
        variant === 'special' && 'bg-purple-100 text-purple-800',
        variant === 'limited' && 'bg-emerald-100 text-emerald-800',
        variant === 'exp' && 'bg-amber-100 text-amber-800',
        variant === 'points' && 'bg-indigo-100 text-indigo-800',
        variant === 'featured' && 'bg-yellow-100 text-yellow-800',
        variant === 'new' && 'bg-rose-100 text-rose-800',
        className
      )}
      {...props}
    />
  );
} 