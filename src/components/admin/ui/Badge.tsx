'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { VariantProps, cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-indigo-100 text-indigo-800',
        secondary: 'bg-gray-100 text-gray-800',
        success: 'bg-emerald-100 text-emerald-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-amber-100 text-amber-800',
        info: 'bg-indigo-100 text-indigo-800',
        purple: 'bg-purple-100 text-purple-800',
        indigo: 'bg-indigo-100 text-indigo-800',
      },
      size: {
        default: 'text-xs',
        sm: 'text-[10px]',
        lg: 'text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { badgeVariants };