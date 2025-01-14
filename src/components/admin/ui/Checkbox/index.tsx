'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { CheckboxProps } from './types';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, label, error, ...props }, ref) => {
    return (
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-admin-primary focus:ring-admin-primary',
              'transition-colors duration-200',
              'hover:border-admin-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-2 text-sm">
            <label
              htmlFor={props.id}
              className={cn(
                'font-medium text-gray-700',
                props.disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </label>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';