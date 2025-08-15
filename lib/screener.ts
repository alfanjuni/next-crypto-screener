// Core screener logic with filtering and sorting

import {
  fetchAllTickers,
  fetchKlineData,
  getTopUSDTPairs,
} from '@/lib/api/binance';
import { getLatestStochasticValues, detectStochasticCrossovers } from '@/lib/indicators/stochastic';
import { getLatestRSI, checkRSIThreshold } from '@/lib/indicators/rsi';
import { CryptoSymbol, ScreenerSettings, BinanceTickerResponse } from '@/lib/types';

/**
 * Process raw ticker data and calculate indicators
 */
async function processSymbolData(
  ticker: BinanceTickerResponse,
  settings: ScreenerSettings
): Promise<CryptoSymbol | null> {
  try {
    // Fetch kline data for indicators
    const klines = await fetchKlineData(ticker.symbol, settings.timeframe, 100);
    
    if (klines.length < 50) {
      return null; // Not enough data for reliable indicators
    }

    // Calculate indicators
    const stochastic = getLatestStochasticValues(
      klines,
      settings.indicators.stochastic.fastPeriod,
      settings.indicators.stochastic.slowK,
      settings.indicators.stochastic.slowD
    );

    const rsi = getLatestRSI(klines, settings.indicators.rsi.period);

    // Check if symbol passes filters
    if (!passesIndicatorFilters(stochastic, rsi, settings)) {
      return null;
    }

    // Calculate additional metrics
    const volume1h = parseFloat(ticker.volume) * 24; // Approximate 1h volume
    const marketCap = parseFloat(ticker.lastPrice) * parseFloat(ticker.volume) * 365; // Rough estimate

    return {
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      priceChange24h: parseFloat(ticker.priceChange),
      priceChangePercent24h: parseFloat(ticker.priceChangePercent),
      volume24h: parseFloat(ticker.quoteVolume),
      volume1h,
      marketCap,
      openInterest24h: parseFloat(ticker.quoteVolume) * 0.1, // Estimate
      slowK: stochastic.slowK,
      slowD: stochastic.slowD,
      rsi,
      ranking: 0, // Will be set after sorting
    };
  } catch (error) {
    console.error(`Failed to process ${ticker.symbol}:`, error);
    return null;
  }
}

/**
 * Check if symbol passes indicator filters
 */
function passesIndicatorFilters(
  stochastic: { slowK: number; slowD: number },
  rsi: number,
  settings: ScreenerSettings
): boolean {
  const { indicators } = settings;

  // Check Stochastic filter
  if (indicators.stochastic.enabled) {
    const crossDirection = indicators.stochastic.crossDirection;
    
    if (crossDirection === 'up' && stochastic.slowK <= stochastic.slowD) {
      return false;
    }
    if (crossDirection === 'down' && stochastic.slowK >= stochastic.slowD) {
      return false;
    }
    // 'both' always passes
  }

  // Check RSI filter
  if (indicators.rsi.enabled) {
    if (!checkRSIThreshold(rsi, indicators.rsi.threshold, indicators.rsi.direction)) {
      return false;
    }
  }

  return true;
}

/**
 * Sort symbols based on settings
 */
function sortSymbols(
  symbols: CryptoSymbol[],
  sortColumn: keyof CryptoSymbol,
  sortDirection: 'asc' | 'desc'
): CryptoSymbol[] {
  return symbols.sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    let comparison = 0;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    }

    return sortDirection === 'desc' ? -comparison : comparison;
  });
}

/**
 * Add ranking to symbols based on sort order
 */
function addRanking(symbols: CryptoSymbol[]): CryptoSymbol[] {
  return symbols.map((symbol, index) => ({
    ...symbol,
    ranking: index + 1,
  }));
}

/**
 * Main screener function
 */
export async function runScreener(settings: ScreenerSettings): Promise<{
  symbols: CryptoSymbol[];
  stats: {
    totalSymbols: number;
    filteredSymbols: number;
    avgRSI: number;
    crossovers: number;
  };
}> {
  try {
    console.log('Fetching top USDT pairs...');
    const topPairs = await getTopUSDTPairs(100);
    
    console.log('Fetching ticker data...');
    const allTickers = await fetchAllTickers();
    
    // Filter to only include our top pairs
    const relevantTickers = allTickers.filter(ticker => 
      topPairs.includes(ticker.symbol)
    );

    console.log(`Processing ${relevantTickers.length} symbols...`);
    
    // Process symbols in batches to avoid rate limiting
    const batchSize = 10;
    const symbols: CryptoSymbol[] = [];
    
    for (let i = 0; i < relevantTickers.length; i += batchSize) {
      const batch = relevantTickers.slice(i, i + batchSize);
      const batchPromises = batch.map(ticker => 
        processSymbolData(ticker, settings)
      );
      
      const batchResults = await Promise.all(batchPromises);
      const validSymbols = batchResults.filter((symbol): symbol is CryptoSymbol => 
        symbol !== null
      );
      
      symbols.push(...validSymbols);
      
      // Add small delay between batches
      if (i + batchSize < relevantTickers.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log(`Successfully processed ${symbols.length} symbols`);

    // Sort and rank symbols
    const sortedSymbols = sortSymbols(symbols, settings.sortColumn, settings.sortDirection);
    const rankedSymbols = addRanking(sortedSymbols);

    // Calculate statistics
    const avgRSI = symbols.length > 0 ? 
      symbols.reduce((sum, s) => sum + s.rsi, 0) / symbols.length : 0;
    
    const crossovers = symbols.filter(s => 
      Math.abs(s.slowK - s.slowD) < 5 // Close to crossover
    ).length;

    return {
      symbols: rankedSymbols,
      stats: {
        totalSymbols: relevantTickers.length,
        filteredSymbols: symbols.length,
        avgRSI,
        crossovers,
      },
    };
  } catch (error) {
    console.error('Screener error:', error);
    return {
      symbols: [],
      stats: {
        totalSymbols: 0,
        filteredSymbols: 0,
        avgRSI: 0,
        crossovers: 0,
      },
    };
  }
}

/**
 * Get default screener settings
 */
export function getDefaultSettings(): ScreenerSettings {
  return {
    timeframe: '1h',
    indicators: {
      stochastic: {
        enabled: true,
        fastPeriod: 10,
        slowK: 5,
        slowD: 5,
        crossDirection: 'both',
      },
      rsi: {
        enabled: true,
        period: 14,
        threshold: 50,
        direction: 'both',
      },
    },
    sortColumn: 'volume24h',
    sortDirection: 'desc',
    refreshInterval: 60000, // 1 minute
  };
}