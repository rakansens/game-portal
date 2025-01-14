'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { CheckboxProps } from './types';
import {
  checkboxContainerStyles,
  checkboxWrapperStyles,
  checkboxStyles,
  labelContainerStyles,
  labelStyles,
  helperTextStyles,
} from './styles';

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, error, disabled, ...props }, ref) => {
    return (
      <div className={checkboxContainerStyles}>
        <div className={checkboxWrapperStyles}>
          <input
            type="checkbox"
            className={cn(
              checkboxStyles({
                error: !!error,
                disabled,
              }),
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
        </div>
        {(label || helperText || error) && (
          <div className={labelContainerStyles}>
            {label && (
              <label
                className={cn(
                  labelStyles({
                    error: !!error,
                    disabled,
                  })
                )}
              >
                {label}
              </label>
            )}
            {(helperText || error) && (
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
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };