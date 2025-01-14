'use client';

import { cn } from '@/utils/cn';
import { BadgeProps } from './types';

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-admin-primary/10 text-admin-primary',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  special: 'bg-purple-100 text-purple-800',
  limited: 'bg-pink-100 text-pink-800',
} as const;

const sizeStyles = {
  default: 'px-2.5 py-1 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
} as const;

export function Badge({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'rounded-full transition-colors duration-200',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}