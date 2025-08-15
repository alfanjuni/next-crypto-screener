'use client';

import { Input as ShadcnInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

/**
 * Custom Input atom component extending shadcn/ui Input
 * Provides error states and helper text
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <ShadcnInput
          ref={ref}
          className={cn(
            'transition-colors duration-200',
            error && 'border-destructive focus:border-destructive',
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={cn(
            'text-sm mt-1',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';