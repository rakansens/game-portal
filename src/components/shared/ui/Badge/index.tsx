'use client';

import { cn } from '@/utils/cn';
import { BadgeProps } from './types';
import { badgeVariants } from './styles';

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}