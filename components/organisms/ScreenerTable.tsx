"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";
import { SortableHeader } from "@/components/molecules/SortableHeader";
import { TableRow } from "@/components/molecules/TableRow";
import { CryptoSymbol } from "@/lib/types";
import { Card } from "@/components/ui/card";

interface ScreenerTableProps {
  data: CryptoSymbol[];
  sortColumn: keyof CryptoSymbol;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof CryptoSymbol) => void;
  loading?: boolean;
}

/**
 * ScreenerTable organism component
 * Main table displaying all crypto symbols with their indicators
 */
export function ScreenerTable({
  data,
  sortColumn,
  sortDirection,
  onSort,
  loading = false,
}: ScreenerTableProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading market data...</p>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <ShadcnTableRow>
              <SortableHeader
                column="ranking"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              >
                Rank
              </SortableHeader>

              <SortableHeader
                column="symbol"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
              >
                Symbol
              </SortableHeader>
              <SortableHeader
                column="signal"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                Signal
              </SortableHeader>

              <SortableHeader
                column="price"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                Price
              </SortableHeader>

              <SortableHeader
                column="slowK"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                Slow %K
              </SortableHeader>

              <SortableHeader
                column="slowD"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                Slow %D
              </SortableHeader>

              <SortableHeader
                column="rsi"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                RSI
              </SortableHeader>
              <SortableHeader
                column="rsiHTF"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                HTF RSI
              </SortableHeader>

              <SortableHeader
                column="slowKHTF"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                HTF Slow %K
              </SortableHeader>

              <SortableHeader
                column="slowDHTF"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                HTF Slow %D
              </SortableHeader>

              <SortableHeader
                column="priceChangePercent24h"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                24h %
              </SortableHeader>

              <SortableHeader
                column="volume24h"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                Volume 24h
              </SortableHeader>

              <SortableHeader
                column="volume1h"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                Volume 1h
              </SortableHeader>

              <SortableHeader
                column="marketCap"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                Market Cap
              </SortableHeader>

              <SortableHeader
                column="openInterest24h"
                currentSort={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="text-right"
              >
                Open Interest
              </SortableHeader>
            </ShadcnTableRow>
          </TableHeader>

          <TableBody>
            {data.map((symbol, index) => (
              <TableRow key={symbol.symbol} symbol={symbol} index={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
