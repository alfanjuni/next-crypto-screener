// RSI (Relative Strength Index) calculation

import { KlineData } from '@/lib/types';

/**
 * Calculate RSI using Wilder's smoothing method
 * @param klines - Array of kline data
 * @param period - RSI period (default: 14)
 * @returns Array of RSI values
 */
export function calculateRSI(
  klines: KlineData[],
  period: number = 14
): number[] {
  if (klines.length < period + 1) {
    return [];
  }
  
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < klines.length; i++) {
    const change = klines[i].close - klines[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  
  // Calculate initial averages
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  // Calculate first RSI value
  let rs = avgGain / (avgLoss || 0.0001); // Avoid division by zero
  rsi.push(100 - (100 / (1 + rs)));
  
  // Calculate subsequent RSI values using Wilder's smoothing
  for (let i = period; i < gains.length; i++) {
    avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
    
    rs = avgGain / (avgLoss || 0.0001);
    rsi.push(100 - (100 / (1 + rs)));
  }
  
  return rsi;
}

/**
 * Get the latest RSI value
 * @param klines - Array of kline data
 * @param period - RSI period (default: 14)
 * @returns Latest RSI value
 */
export function getLatestRSI(
  klines: KlineData[],
  period: number = 14
): number {
  const rsiValues = calculateRSI(klines, period);
  return rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : 0;
}

/**
 * Check if RSI meets threshold criteria
 * @param rsi - RSI value
 * @param threshold - Threshold value
 * @param direction - 'above', 'below', or 'both'
 * @returns Boolean indicating if criteria is met
 */
export function checkRSIThreshold(
  rsi: number,
  threshold: number,
  direction: 'above' | 'below' | 'both'
): boolean {
  switch (direction) {
    case 'above':
      return rsi > threshold;
    case 'below':
      return rsi < threshold;
    case 'both':
      return true;
    default:
      return false;
  }
}

/**
 * Classify RSI level
 * @param rsi - RSI value
 * @returns String classification
 */
export function classifyRSI(rsi: number): 'oversold' | 'oversought' | 'neutral' {
  if (rsi < 30) return 'oversold';
  if (rsi > 70) return 'oversought';
  return 'neutral';
}

/**
 * Calculate RSI divergence (basic implementation)
 * @param prices - Array of prices
 * @param rsiValues - Array of RSI values
 * @param lookback - Number of periods to look back
 * @returns Object with divergence information
 */
export function calculateRSIDivergence(
  prices: number[],
  rsiValues: number[],
  lookback: number = 10
): {
  bullishDivergence: boolean;
  bearishDivergence: boolean;
} {
  if (prices.length < lookback || rsiValues.length < lookback) {
    return { bullishDivergence: false, bearishDivergence: false };
  }
  
  const recentPrices = prices.slice(-lookback);
  const recentRSI = rsiValues.slice(-lookback);
  
  const priceMin = Math.min(...recentPrices);
  const priceMax = Math.max(...recentPrices);
  const rsiMin = Math.min(...recentRSI);
  const rsiMax = Math.max(...recentRSI);
  
  const priceMinIndex = recentPrices.indexOf(priceMin);
  const priceMaxIndex = recentPrices.indexOf(priceMax);
  const rsiMinIndex = recentRSI.indexOf(rsiMin);
  const rsiMaxIndex = recentRSI.indexOf(rsiMax);
  
  // Basic divergence detection
  const bullishDivergence = priceMinIndex < lookback / 2 && rsiMinIndex > lookback / 2;
  const bearishDivergence = priceMaxIndex < lookback / 2 && rsiMaxIndex > lookback / 2;
  
  return { bullishDivergence, bearishDivergence };
}