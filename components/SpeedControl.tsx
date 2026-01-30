'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 150;

const SPEED_STORAGE_KEY = 'dsa-visualizer-speed-ms';
const MIN_SPEED_MS = 100;
const MAX_SPEED_MS = 3000;
const STEP_MS = 100;

const PRESETS = [
  { label: 'Slow', value: 2000 },
  { label: 'Normal', value: 1000 },
  { label: 'Fast', value: 300 },
] as const;

function getStoredSpeed(): number {
  if (typeof window === 'undefined') return 1000;
  try {
    const stored = localStorage.getItem(SPEED_STORAGE_KEY);
    if (stored) {
      const n = Number(stored);
      if (n >= MIN_SPEED_MS && n <= MAX_SPEED_MS) return n;
    }
  } catch {
    // ignore
  }
  return 1000;
}

function speedToMultiplier(ms: number): string {
  return (1000 / ms).toFixed(1);
}

interface SpeedControlProps {
  value: number;
  onChange: (speedMs: number) => void;
  disabled?: boolean;
  className?: string;
}

export function SpeedControl({
  value,
  onChange,
  disabled = false,
  className,
}: SpeedControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const persistAndNotify = useCallback(
    (speedMs: number) => {
      setLocalValue(speedMs);
      onChange(speedMs);
      try {
        localStorage.setItem(SPEED_STORAGE_KEY, String(speedMs));
      } catch {
        // ignore
      }
    },
    [onChange]
  );

  const debouncedPersist = useCallback(
    (speedMs: number) => {
      setLocalValue(speedMs);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        onChange(speedMs);
        try {
          localStorage.setItem(SPEED_STORAGE_KEY, String(speedMs));
        } catch {
          // ignore
        }
      }, DEBOUNCE_MS);
    },
    [onChange]
  );

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-4">
        <Label className="text-sm font-semibold text-muted-foreground shrink-0">
          Speed: {speedToMultiplier(localValue)}x
        </Label>
        <Slider
          min={MIN_SPEED_MS}
          max={MAX_SPEED_MS}
          step={STEP_MS}
          value={[localValue]}
          onValueChange={([v]) => debouncedPersist(v)}
          disabled={disabled}
          className="flex-1 max-w-[180px]"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(({ label, value: presetMs }) => (
          <Button
            key={label}
            type="button"
            variant={localValue === presetMs ? 'default' : 'outline'}
            size="sm"
            onClick={() => persistAndNotify(presetMs)}
            disabled={disabled}
            className="text-xs"
          >
            {label} ({presetMs}ms)
          </Button>
        ))}
      </div>
    </div>
  );
}

export { getStoredSpeed, MIN_SPEED_MS, MAX_SPEED_MS };
