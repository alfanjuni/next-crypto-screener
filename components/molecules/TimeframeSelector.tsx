"use client";

import { Dropdown } from "@/components/atoms/Dropdown";
import { ScreenerSettings } from "@/lib/types";

interface TimeframeSelectorProps {
  value: ScreenerSettings["timeframe"];
  onChange: (timeframe: ScreenerSettings["timeframe"]) => void;
  disabled?: boolean;
}

const timeframeOptions = [
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "12h", label: "12 Hours" },
  { value: "1d", label: "1 Day" },
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
