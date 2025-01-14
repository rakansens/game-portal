'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { InputProps } from './types';
import {
  inputContainerStyles,
  labelStyles,
  inputStyles,
  helperTextStyles,
} from './styles';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, disabled, ...props }, ref) => {
    return (
      <div className={inputContainerStyles}>
        {label && (
          <label className={labelStyles}>
            {label}
          </label>
        )}
        <input
          className={cn(
            inputStyles({
              error: !!error,
              disabled,
            }),
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
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

Input.displayName = 'Input';

export { Input };