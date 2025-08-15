'use client';

import { TableHead } from '@/components/ui/table';
import { Button } from '@/components/atoms/Button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CryptoSymbol } from '@/lib/types';

interface SortableHeaderProps {
  column: keyof CryptoSymbol;
  currentSort: keyof CryptoSymbol;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof CryptoSymbol) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * SortableHeader molecule component
 * Provides sortable column headers for the screener table
 */
export function SortableHeader({
  column,
  currentSort,
  sortDirection,
  onSort,
  children,
  className,
}: SortableHeaderProps) {
  const isActive = currentSort === column;
  const Icon = sortDirection === 'asc' ? ChevronUp : ChevronDown;

  return (
    <TableHead className={cn('p-0', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSort(column)}
        className={cn(
          'w-full justify-between h-auto px-3 py-2 font-medium',
          'hover:bg-muted/50 transition-colors duration-200',
          isActive && 'text-primary'
        )}
      >
        <span>{children}</span>
        {isActive && (
          <Icon className="h-4 w-4 ml-2 transition-transform duration-200" />
        )}
      </Button>
    </TableHead>
  );
}