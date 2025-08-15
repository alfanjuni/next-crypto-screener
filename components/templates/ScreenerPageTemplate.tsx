'use client';

import { ScreenerTable } from '@/components/organisms/ScreenerTable';
import { ScreenerSettingsPanel } from '@/components/organisms/ScreenerSettingsPanel';
import { CryptoSymbol, ScreenerSettings } from '@/lib/types';
import { TrendingUp, Activity, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScreenerPageTemplateProps {
  data: CryptoSymbol[];
  settings: ScreenerSettings;
  onSettingsChange: (settings: ScreenerSettings) => void;
  onSort: (column: keyof CryptoSymbol) => void;
  onRefresh: () => void;
  loading: boolean;
  stats: {
    totalSymbols: number;
    filteredSymbols: number;
    avgRSI: number;
    crossovers: number;
  };
}

/**
 * ScreenerPageTemplate template component
 * Main layout template for the crypto screener page
 */
export function ScreenerPageTemplate({
  data,
  settings,
  onSettingsChange,
  onSort,
  onRefresh,
  loading,
  stats,
}: ScreenerPageTemplateProps) {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Crypto Technical Screener
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced cryptocurrency screening with Stochastic and RSI indicators
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Symbols</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSymbols}</div>
            <p className="text-xs text-muted-foreground">
              Tracked symbols
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.filteredSymbols}</div>
            <p className="text-xs text-muted-foreground">
              Match criteria
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average RSI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRSI.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Market momentum
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crossovers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.crossovers}</div>
            <p className="text-xs text-muted-foreground">
              Stoch signals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      <ScreenerSettingsPanel
        settings={settings}
        onSettingsChange={onSettingsChange}
        onRefresh={onRefresh}
        isLoading={loading}
      />

      {/* Main Table */}
      <ScreenerTable
        data={data}
        sortColumn={settings.sortColumn}
        sortDirection={settings.sortDirection}
        onSort={onSort}
        loading={loading}
      />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Data provided by Binance API • Updated every {settings.refreshInterval / 1000} seconds
        </p>
        <p className="mt-1">
          Timeframe: {settings.timeframe} • 
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}