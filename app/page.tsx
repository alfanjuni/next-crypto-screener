'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ScreenerPageTemplate } from '@/components/templates/ScreenerPageTemplate';
import { CryptoSymbol, ScreenerSettings } from '@/lib/types';
import { runScreener, getDefaultSettings } from '@/lib/screener';

/**
 * Main screener page component
 * Manages state and data flow for the entire application
 */
export default function ScreenerPage() {
  const [data, setData] = useState<CryptoSymbol[]>([]);
  const [settings, setSettings] = useState<ScreenerSettings>(getDefaultSettings);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [stats, setStats] = useState({
    totalSymbols: 0,
    filteredSymbols: 0,
    avgRSI: 0,
    crossovers: 0,
  });

  /**
   * Fetch and process screener data
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await runScreener(settings);
      setData(result.symbols);
      setStats(result.stats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch screener data:', error);
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, [settings]);

  /**
   * Handle settings changes and trigger data refresh
   */
  const handleSettingsChange = useCallback((newSettings: ScreenerSettings) => {
    setSettings(newSettings);
    // Trigger immediate refresh if timeframe or indicators changed
    if (
      newSettings.timeframe !== settings.timeframe ||
      JSON.stringify(newSettings.indicators) !== JSON.stringify(settings.indicators)
    ) {
      // Debounce rapid changes
      setTimeout(() => {
        fetchData();
      }, 500);
    }
  }, [settings, fetchData]);

  /**
   * Handle column sorting
   */
  const handleSort = useCallback((column: keyof CryptoSymbol) => {
    setSettings(prev => {
      const newDirection = prev.sortColumn === column && prev.sortDirection === 'desc' 
        ? 'asc' 
        : 'desc';
      
      return {
        ...prev,
        sortColumn: column,
        sortDirection: newDirection,
      };
    });
  }, []);

  /**
   * Manual refresh handler
   */
  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Sort data in memory when sort settings change
   */
  const sortedData = useMemo(() => {
    if (!data.length) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[settings.sortColumn];
      const bValue = b[settings.sortColumn];

      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return settings.sortDirection === 'desc' ? -comparison : comparison;
    });

    // Update rankings
    return sorted.map((symbol, index) => ({
      ...symbol,
      ranking: index + 1,
    }));
  }, [data, settings.sortColumn, settings.sortDirection]);

  /**
   * Initial data load
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Auto-refresh timer
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchData();
      }
    }, settings.refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, loading, settings.refreshInterval]);

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleRefresh]);

  return (
    <ScreenerPageTemplate
      data={sortedData}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      onSort={handleSort}
      onRefresh={handleRefresh}
      loading={loading}
      stats={stats}
    />
  );
}