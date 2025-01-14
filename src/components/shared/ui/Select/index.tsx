'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { SelectProps } from './types';
import {
  selectContainerStyles,
  labelStyles,
  selectStyles,
  helperTextStyles,
} from './styles';

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, helperText, options, disabled, ...props }, ref) => {
    return (
      <div className={selectContainerStyles}>
        {label && (
          <label className={labelStyles}>
            {label}
          </label>
        )}
        <select
          className={cn(
            selectStyles({
              error: !!error,
              disabled,
            }),
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {(error || helperText) && (
          <p
            className={cn(
              helperTextStyles({
                error: !!error,
              })
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };