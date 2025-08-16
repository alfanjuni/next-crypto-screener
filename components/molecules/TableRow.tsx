"use client";

import { TableRow as ShadcnTableRow } from "@/components/ui/table";
import { TableCell } from "@/components/atoms/TableCell";
import { Badge } from "@/components/atoms/Badge";
import { CryptoSymbol } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TableRowProps {
  symbol: CryptoSymbol;
  index: number;
}

/**
 * TableRow molecule component
 * Renders a single row in the crypto screener table
 */
export function TableRow({ symbol, index }: TableRowProps) {
  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toFixed(2);
    } else if (price >= 0.01) {
      return price.toFixed(4);
    } else {
      return price.toFixed(8);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  const getPriceChangeColor = (
    change: number
  ): "positive" | "negative" | "neutral" => {
    if (change > 0) return "positive";
    if (change < 0) return "negative";
    return "neutral";
  };

  const getRSIBadgeColor = (
    rsi: number
  ): "green" | "red" | "yellow" | "gray" => {
    if (rsi < 30) return "green"; // Oversold
    if (rsi > 70) return "red"; // Overbought
    if (rsi < 40 || rsi > 60) return "yellow"; // Near extremes
    return "gray"; // Neutral
  };

  const getSignalColor = (
    signal: string
  ): "green" | "red" | "yellow" | "gray" => {
    if (signal === "buy") return "green";
    if (signal === "sell") return "red";
    if (signal === "hold") return "yellow";
    return "gray";
  };

  const getStochasticBadgeColor = (
    k: number,
    d: number
  ): "green" | "red" | "blue" | "gray" => {
    if (k > d && k < 20) return "green"; // Oversold bullish
    if (k < d && k > 80) return "red"; // Overbought bearish
    if (Math.abs(k - d) < 5) return "blue"; // Convergence
    return "gray"; // Neutral
  };

  return (
    <ShadcnTableRow
      className={cn(
        "hover:bg-muted/50 transition-colors duration-200",
        index % 2 === 0 && "bg-background"
      )}
    >
      <TableCell numeric>{symbol.ranking}</TableCell>

      <TableCell className="font-mono font-semibold">{symbol.symbol}</TableCell>
      <TableCell numeric>
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono">{"buy"}</span>
          <Badge
            variant="outline"
            colorScheme={getSignalColor("buy")}
            className="text-xs"
          >
            LONG
          </Badge>
        </div>
      </TableCell>

      <TableCell numeric colorScheme="neutral">
        ${formatPrice(symbol.price)}
      </TableCell>
      <TableCell numeric>
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono">{symbol.slowK.toFixed(2)}</span>
          <Badge
            variant="outline"
            colorScheme={getStochasticBadgeColor(symbol.slowK, symbol.slowD)}
            className="text-xs"
          >
            %K
          </Badge>
        </div>
      </TableCell>

      <TableCell numeric>
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono">{symbol.slowD.toFixed(2)}</span>
          <Badge
            variant="outline"
            colorScheme={getStochasticBadgeColor(symbol.slowK, symbol.slowD)}
            className="text-xs"
          >
            %D
          </Badge>
        </div>
      </TableCell>

      <TableCell numeric>
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono">{symbol.rsi.toFixed(2)}</span>
          <Badge
            variant="outline"
            colorScheme={getRSIBadgeColor(symbol.rsi)}
            className="text-xs"
          >
            RSI
          </Badge>
        </div>
      </TableCell>
      <TableCell numeric>
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono">{symbol.rsi.toFixed(2)}</span>
          <Badge
            variant="outline"
            colorScheme={getRSIBadgeColor(symbol.rsi)}
            className="text-xs"
          >
            RSI
          </Badge>
        </div>
      </TableCell>

      <TableCell numeric>
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono">{symbol.slowK.toFixed(2)}</span>
          <Badge
            variant="outline"
            colorScheme={getStochasticBadgeColor(symbol.slowK, symbol.slowD)}
            className="text-xs"
          >
            %K
          </Badge>
        </div>
      </TableCell>

      <TableCell numeric>
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono">{symbol.slowD.toFixed(2)}</span>
          <Badge
            variant="outline"
            colorScheme={getStochasticBadgeColor(symbol.slowK, symbol.slowD)}
            className="text-xs"
          >
            %D
          </Badge>
        </div>
      </TableCell>

      <TableCell
        numeric
        colorScheme={getPriceChangeColor(symbol.priceChangePercent24h)}
      >
        {symbol.priceChangePercent24h > 0 ? "+" : ""}
        {symbol.priceChangePercent24h.toFixed(2)}%
      </TableCell>

      <TableCell numeric>${formatVolume(symbol.volume24h)}</TableCell>

      <TableCell numeric>${formatVolume(symbol.volume1h)}</TableCell>

      <TableCell numeric>${formatVolume(symbol.marketCap)}</TableCell>

      <TableCell numeric>${formatVolume(symbol.openInterest24h)}</TableCell>
    </ShadcnTableRow>
  );
}
