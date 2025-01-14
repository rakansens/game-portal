'use client';

import { BadgeProps } from './types';
import { cn } from '@/utils/cn';

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-purple-100 text-purple-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  purple: 'bg-purple-100 text-purple-800',
  special: 'bg-purple-100 text-purple-800',
  limited: 'bg-blue-100 text-blue-800',
  exp: 'bg-green-100 text-green-800',
  points: 'bg-yellow-100 text-yellow-800',
};

const sizeStyles = {
  default: 'px-2.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}