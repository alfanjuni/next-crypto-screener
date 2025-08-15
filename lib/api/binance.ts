// Binance API integration with caching and error handling

import { BinanceTickerResponse, BinanceKlineResponse, KlineData } from '@/lib/types';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute in milliseconds

/**
 * Generic cached fetch function
 */
async function cachedFetch<T>(url: string, cacheKey: string): Promise<T> {
  const cached = cache.get(cacheKey);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data as T;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: now });
    return data as T;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    // Return cached data if available, even if stale
    if (cached) {
      return cached.data as T;
    }
    throw error;
  }
}

/**
 * Fetch 24hr ticker statistics for all symbols
 */
export async function fetchAllTickers(): Promise<BinanceTickerResponse[]> {
  const url = `${BINANCE_BASE_URL}/ticker/24hr`;
  return cachedFetch<BinanceTickerResponse[]>(url, 'all-tickers');
}

/**
 * Fetch kline data for a specific symbol and timeframe
 */
export async function fetchKlineData(
  symbol: string, 
  interval: string, 
  limit: number = 100
): Promise<KlineData[]> {
  const url = `${BINANCE_BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const cacheKey = `kline-${symbol}-${interval}-${limit}`;
  
  const rawData = await cachedFetch<BinanceKlineResponse[]>(url, cacheKey);
  
  return rawData.map((kline): KlineData => ({
    openTime: kline[0] as number,
    open: parseFloat(kline[1] as string),
    high: parseFloat(kline[2] as string),
    low: parseFloat(kline[3] as string),
    close: parseFloat(kline[4] as string),
    volume: parseFloat(kline[5] as string),
    closeTime: kline[6] as number,
    quoteAssetVolume: parseFloat(kline[7] as string),
    numberOfTrades: kline[8] as number,
    takerBuyBaseAssetVolume: parseFloat(kline[9] as string),
    takerBuyQuoteAssetVolume: parseFloat(kline[10] as string),
  }));
}

/**
 * Fetch exchange info to get all active symbols
 */
export async function fetchExchangeInfo() {
  const url = `${BINANCE_BASE_URL}/exchangeInfo`;
  return cachedFetch(url, 'exchange-info');
}

/**
 * Get top volume USDT pairs
 */
export async function getTopUSDTPairs(limit: number = 100): Promise<string[]> {
  try {
    const tickers = await fetchAllTickers();
    
    // Filter USDT pairs and sort by quote volume
    const usdtPairs = tickers
      .filter(ticker => ticker.symbol.endsWith('USDT'))
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, limit)
      .map(ticker => ticker.symbol);
    
    return usdtPairs;
  } catch (error) {
    console.error('Failed to fetch top USDT pairs:', error);
    // Fallback to popular pairs
    return [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT',
      'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'LINKUSDT',
      'LTCUSDT', 'UNIUSDT', 'MATICUSDT', 'ALGOUSDT', 'ATOMUSDT'
    ];
  }
}

/**
 * Clear cache manually
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache size for debugging
 */
export function getCacheSize(): number {
  return cache.size;
}