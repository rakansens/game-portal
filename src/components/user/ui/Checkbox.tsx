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
            'h-4 w-4 rounded border-2 border-gray-200 text-blue-500 focus:ring-blue-500',
            error && 'border-rose-300 focus:ring-rose-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label className="ml-2.5 block text-sm text-gray-700">
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-rose-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'UserCheckbox';

export { Checkbox };