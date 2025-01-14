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
        buttonVariants({ variant, size }),
        fullWidth && 'w-full',
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