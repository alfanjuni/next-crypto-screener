// Type definitions for the crypto screener application

export interface CryptoSymbol {
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  volume24h: number;
  volume1h: number;
  marketCap: number;
  openInterest24h: number;
  slowK: number;
  slowD: number;
  rsi: number;
  slowKHTF: number; // Higher TF indicators
  slowDHTF: number;
  rsiHTF: number;
  ranking: number;
  signal: string;
}

export interface KlineData {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

export interface IndicatorSettings {
  stochastic: {
    enabled: boolean;
    fastPeriod: number;
    slowK: number;
    slowD: number;
    crossDirection: "up" | "down" | "both";
  };
  rsi: {
    enabled: boolean;
    period: number;
    threshold: number;
    direction: "above" | "below" | "both";
  };
}

export interface ScreenerSettings {
  timeframe: "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "12h" | "1d";
  indicators: IndicatorSettings;
  sortColumn: keyof CryptoSymbol;
  sortDirection: "asc" | "desc";
  refreshInterval: number;
}

export interface BinanceTickerResponse {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceKlineResponse extends Array<string | number> {
  0: number; // Open time
  1: string; // Open
  2: string; // High
  3: string; // Low
  4: string; // Close
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}
