"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeframeSelector } from "@/components/molecules/TimeframeSelector";
import { IndicatorSettingsForm } from "@/components/molecules/IndicatorSettingsForm";
import { Button } from "@/components/atoms/Button";
import { ScreenerSettings } from "@/lib/types";
import { RefreshCw, Settings } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ScreenerSettingsPanelProps {
  settings: ScreenerSettings;
  onSettingsChange: (settings: ScreenerSettings) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

/**
 * ScreenerSettingsPanel organism component
 * Contains all controls for configuring the screener
 */
export function ScreenerSettingsPanel({
  settings,
  onSettingsChange,
  onRefresh,
  isLoading = false,
}: ScreenerSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTimeframeChange = (timeframe: ScreenerSettings["timeframe"]) => {
    onSettingsChange({
      ...settings,
      timeframe,
    });
  };

  const handleIndicatorSettingsChange = (
    indicators: ScreenerSettings["indicators"]
  ) => {
    onSettingsChange({
      ...settings,
      indicators,
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <TimeframeSelector
              value={settings.timeframe}
              onChange={handleTimeframeChange}
              disabled={isLoading}
            />

            <Button
              onClick={onRefresh}
              loading={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>

            <div className="text-sm text-muted-foreground">
              Auto-refresh: {settings.refreshInterval / 1000}s
            </div>

            {/* NEW TOGGLE */}
            <div className="flex items-center space-x-2">
              <Switch
                id="lighter-only"
                checked={settings.lighterOnly ?? false}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, lighterOnly: checked })
                }
              />
              <Label htmlFor="lighter-only">Lighter Only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            size="sm"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced Indicator Settings
            </span>
            <span className="text-xs">{isExpanded ? "Hide" : "Show"}</span>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 pt-4">
          <IndicatorSettingsForm
            settings={settings.indicators}
            onChange={handleIndicatorSettingsChange}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
