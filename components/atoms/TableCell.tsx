'use client';

import { TableCell as ShadcnTableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TdHTMLAttributes } from 'react';

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
  highlight?: boolean;
  colorScheme?: 'positive' | 'negative' | 'neutral';
}

/**
 * Custom TableCell atom component extending shadcn/ui TableCell
 * Provides numeric alignment and color coding for financial data
 */
export function TableCell({ 
  className, 
  numeric = false,
  highlight = false,
  colorScheme = 'neutral',
  children, 
  ...props 
}: TableCellProps) {
  const colorClasses = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-foreground',
  };

  return (
    <ShadcnTableCell
      className={cn(
        'transition-colors duration-200',
        numeric && 'text-right font-mono',
        highlight && 'bg-muted/50',
        colorClasses[colorScheme],
        className
      )}
      {...props}
    >
      {children}
    </ShadcnTableCell>
  );
}