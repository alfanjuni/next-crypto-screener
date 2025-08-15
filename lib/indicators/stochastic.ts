// Stochastic Slow indicator calculation

import { KlineData } from '@/lib/types';

/**
 * Simple Moving Average calculation
 */
function sma(data: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  
  return result;
}

/**
 * Calculate Stochastic %K
 */
function calculateStochasticK(
  klines: KlineData[], 
  period: number
): number[] {
  const stochK: number[] = [];
  
  for (let i = period - 1; i < klines.length; i++) {
    const slice = klines.slice(i - period + 1, i + 1);
    const high = Math.max(...slice.map(k => k.high));
    const low = Math.min(...slice.map(k => k.low));
    const close = klines[i].close;
    
    const k = high === low ? 50 : ((close - low) / (high - low)) * 100;
    stochK.push(k);
  }
  
  return stochK;
}

/**
 * Calculate Stochastic Slow indicator
 * @param klines - Array of kline data
 * @param fastPeriod - Fast %K period (default: 10)
 * @param slowKPeriod - Slow %K smoothing period (default: 5)
 * @param slowDPeriod - Slow %D smoothing period (default: 5)
 * @returns Object containing Slow %K and Slow %D arrays
 */
export function calculateStochasticSlow(
  klines: KlineData[],
  fastPeriod: number = 10,
  slowKPeriod: number = 5,
  slowDPeriod: number = 5
): { slowK: number[]; slowD: number[] } {
  if (klines.length < fastPeriod + slowKPeriod + slowDPeriod - 2) {
    return { slowK: [], slowD: [] };
  }
  
  // Calculate Fast %K
  const fastK = calculateStochasticK(klines, fastPeriod);
  
  // Calculate Slow %K (SMA of Fast %K)
  const slowK = sma(fastK, slowKPeriod);
  
  // Calculate Slow %D (SMA of Slow %K)
  const slowD = sma(slowK, slowDPeriod);
  
  return { slowK, slowD };
}

/**
 * Detect Stochastic crossovers
 * @param slowK - Slow %K values
 * @param slowD - Slow %D values
 * @returns Object with crossover information
 */
export function detectStochasticCrossovers(
  slowK: number[],
  slowD: number[]
): {
  lastCrossover: 'up' | 'down' | 'none';
  crossoverIndex: number;
  currentK: number;
  currentD: number;
} {
  if (slowK.length < 2 || slowD.length < 2) {
    return {
      lastCrossover: 'none',
      crossoverIndex: -1,
      currentK: 0,
      currentD: 0
    };
  }
  
  const currentK = slowK[slowK.length - 1];
  const currentD = slowD[slowD.length - 1];
  const prevK = slowK[slowK.length - 2];
  const prevD = slowD[slowD.length - 2];
  
  let lastCrossover: 'up' | 'down' | 'none' = 'none';
  let crossoverIndex = -1;
  
  // Check for recent crossover
  if (prevK <= prevD && currentK > currentD) {
    lastCrossover = 'up';
    crossoverIndex = slowK.length - 1;
  } else if (prevK >= prevD && currentK < currentD) {
    lastCrossover = 'down';
    crossoverIndex = slowK.length - 1;
  }
  
  return {
    lastCrossover,
    crossoverIndex,
    currentK,
    currentD
  };
}

/**
 * Get latest Stochastic values for a symbol
 */
export function getLatestStochasticValues(
  klines: KlineData[],
  fastPeriod: number = 10,
  slowKPeriod: number = 5,
  slowDPeriod: number = 5
): { slowK: number; slowD: number } {
  const { slowK, slowD } = calculateStochasticSlow(
    klines, 
    fastPeriod, 
    slowKPeriod, 
    slowDPeriod
  );
  
  if (slowK.length === 0 || slowD.length === 0) {
    return { slowK: 0, slowD: 0 };
  }
  
  return {
    slowK: slowK[slowK.length - 1],
    slowD: slowD[slowD.length - 1]
  };
}