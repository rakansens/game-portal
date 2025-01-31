import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // サイズバリエーション
          {
            'px-2.5 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          // カラーバリエーション
          {
            'bg-admin-primary text-white hover:bg-admin-primary/90 focus:ring-admin-primary/50':
              variant === 'primary',
            'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-admin-primary/50':
              variant === 'secondary',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
              variant === 'danger',
            'text-gray-700 hover:bg-gray-100 focus:ring-admin-primary/50':
              variant === 'ghost',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
