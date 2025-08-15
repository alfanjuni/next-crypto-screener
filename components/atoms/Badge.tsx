'use client';

import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  colorScheme?: 'green' | 'red' | 'blue' | 'yellow' | 'purple' | 'gray';
}

/**
 * Custom Badge atom component extending shadcn/ui Badge
 * Provides additional color schemes for different data types
 */
export function Badge({ 
  className, 
  variant = 'default', 
  colorScheme,
  children, 
  ...props 
}: BadgeProps) {
  const colorClasses = {
    green: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30',
    gray: 'bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30',
  };

  return (
    <ShadcnBadge
      variant={colorScheme ? 'outline' : variant}
      className={cn(
        'transition-colors duration-200',
        colorScheme && colorClasses[colorScheme],
        className
      )}
      {...props}
    >
      {children}
    </ShadcnBadge>
  );
}