'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, error, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-blue-600',
              'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              error && 'border-red-300 focus:ring-red-500',
              props.disabled && 'cursor-not-allowed opacity-50',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(label || helperText || error) && (
          <div className="ml-3">
            {label && (
              <label
                className={cn(
                  'text-sm font-medium',
                  error ? 'text-red-600' : 'text-gray-700',
                  props.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {(helperText || error) && (
              <p
                className={cn(
                  'text-sm',
                  error ? 'text-red-600' : 'text-gray-500'
                )}
              >
                {error || helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };