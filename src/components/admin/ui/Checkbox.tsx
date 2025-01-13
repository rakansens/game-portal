'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'AdminCheckbox';

export { Checkbox };