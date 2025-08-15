'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/atoms/Input';
import { Dropdown } from '@/components/atoms/Dropdown';
import { IndicatorSettings } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface IndicatorSettingsFormProps {
  settings: IndicatorSettings;
  onChange: (settings: IndicatorSettings) => void;
}

const crossDirectionOptions = [
  { value: 'up', label: 'Cross Up' },
  { value: 'down', label: 'Cross Down' },
  { value: 'both', label: 'Both Directions' },
];

const rsiDirectionOptions = [
  { value: 'above', label: 'Above Threshold' },
  { value: 'below', label: 'Below Threshold' },
  { value: 'both', label: 'Both Directions' },
];

/**
 * IndicatorSettingsForm molecule component
 * Provides form controls for configuring technical indicators
 */
export function IndicatorSettingsForm({ 
  settings, 
  onChange 
}: IndicatorSettingsFormProps) {
  const updateStochasticSetting = (key: keyof IndicatorSettings['stochastic'], value: any) => {
    onChange({
      ...settings,
      stochastic: {
        ...settings.stochastic,
        [key]: value,
      },
    });
  };

  const updateRSISetting = (key: keyof IndicatorSettings['rsi'], value: any) => {
    onChange({
      ...settings,
      rsi: {
        ...settings.rsi,
        [key]: value,
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Indicator Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stochastic Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="stoch-enabled" className="text-base font-medium">
              Stochastic Slow
            </Label>
            <Switch
              id="stoch-enabled"
              checked={settings.stochastic.enabled}
              onCheckedChange={(checked) => updateStochasticSetting('enabled', checked)}
            />
          </div>
          
          {settings.stochastic.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-muted">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm">Fast Period</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.stochastic.fastPeriod}
                    onChange={(e) => updateStochasticSetting('fastPeriod', parseInt(e.target.value) || 10)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Slow %K</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.stochastic.slowK}
                    onChange={(e) => updateStochasticSetting('slowK', parseInt(e.target.value) || 5)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Slow %D</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.stochastic.slowD}
                    onChange={(e) => updateStochasticSetting('slowD', parseInt(e.target.value) || 5)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm">Cross Direction</Label>
                <Dropdown
                  options={crossDirectionOptions}
                  value={settings.stochastic.crossDirection}
                  onValueChange={(value) => updateStochasticSetting('crossDirection', value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* RSI Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="rsi-enabled" className="text-base font-medium">
              RSI
            </Label>
            <Switch
              id="rsi-enabled"
              checked={settings.rsi.enabled}
              onCheckedChange={(checked) => updateRSISetting('enabled', checked)}
            />
          </div>
          
          {settings.rsi.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-muted">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Period</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.rsi.period}
                    onChange={(e) => updateRSISetting('period', parseInt(e.target.value) || 14)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Threshold</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.rsi.threshold}
                    onChange={(e) => updateRSISetting('threshold', parseFloat(e.target.value) || 50)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm">Direction</Label>
                <Dropdown
                  options={rsiDirectionOptions}
                  value={settings.rsi.direction}
                  onValueChange={(value) => updateRSISetting('direction', value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}