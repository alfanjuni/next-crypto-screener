"use client";

import { Dropdown } from "@/components/atoms/Dropdown";
import { ScreenerSettings } from "@/lib/types";

interface TimeframeSelectorProps {
  value: ScreenerSettings["timeframe"];
  onChange: (timeframe: ScreenerSettings["timeframe"]) => void;
  disabled?: boolean;
}

const timeframeOptions = [
  { value: "1m", label: "1 Minute", htfValue: "15m" },
  { value: "5m", label: "5 Minutes", htfValue: "1h" },
  { value: "15m", label: "15 Minutes", htfValue: "4h" },
  { value: "30m", label: "30 Minutes", htfValue: "12h" },
  { value: "1h", label: "1 Hour", htfValue: "1d" },
  { value: "4h", label: "4 Hours", htfValue: "1W" },
  { value: "12h", label: "12 Hours", htfValue: "2W" },
  { value: "1d", label: "1 Day", htfValue: "1M" },
];

/**
 * TimeframeSelector molecule component
 * Handles timeframe selection for data fetching
 */
export function TimeframeSelector({
  value,
  onChange,
  disabled = false,
}: TimeframeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">
        Timeframe
      </label>
      <Dropdown
        options={timeframeOptions}
        value={value}
        onValueChange={(val) => onChange(val as ScreenerSettings["timeframe"])}
        placeholder="Select timeframe"
        disabled={disabled}
        className="w-40"
      />
    </div>
  );
}
