'use client';

import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

/**
 * Custom Button atom component extending shadcn/ui Button
 * Provides additional loading state and consistent styling
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, children, disabled, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        className={cn(
          'transition-all duration-200 hover:scale-105 active:scale-95',
          loading && 'opacity-70 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </ShadcnButton>
    );
  }
);

Button.displayName = 'Button';