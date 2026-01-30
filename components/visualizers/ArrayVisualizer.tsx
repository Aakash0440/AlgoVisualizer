'use client';

import React, { useMemo } from 'react';

interface ArrayVisualizerProps {
  values: number[];
  comparing?: number[];
  compared?: number[];
  sorted?: number[];
  visited?: number[];
  maxValue?: number;
}

export function ArrayVisualizer({
  values,
  comparing = [],
  compared = [],
  sorted = [],
  visited = [],
  maxValue,
}: ArrayVisualizerProps) {
  const max = useMemo(() => maxValue || Math.max(...values, 1), [values, maxValue]);

  return (
    <div className="w-full h-96 flex items-end justify-center gap-1.5 px-4 relative">
      {values.map((value, index) => {
        let bgColor = 'bg-gradient-to-t from-primary to-accent';
        let shadowColor = 'shadow-lg shadow-primary/30';
        let heightPercent = (value / max) * 100;

        if (sorted.includes(index)) {
          bgColor = 'bg-gradient-to-t from-green-500 to-green-400 dark:from-green-600 dark:to-green-500';
          shadowColor = 'shadow-lg shadow-green-500/40';
        } else if (compared.includes(index)) {
          bgColor = 'bg-gradient-to-t from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500';
          shadowColor = 'shadow-lg shadow-orange-500/40';
        } else if (comparing.includes(index)) {
          bgColor = 'bg-gradient-to-t from-red-500 to-red-400 dark:from-red-600 dark:to-red-500';
          shadowColor = 'shadow-lg shadow-red-500/50';
        } else if (visited.includes(index)) {
          bgColor = 'bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500';
          shadowColor = 'shadow-lg shadow-blue-500/30';
        }

        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center justify-end relative group"
            style={{ height: '100%' }}
          >
            <div
              className={`w-full ${bgColor} ${shadowColor} rounded-t-md transition-all duration-100 ease-in-out hover:scale-105 origin-bottom cursor-pointer relative`}
              style={{
                height: `${heightPercent}%`,
                minHeight: '6px',
              }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-semibold pointer-events-none">
                {value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
