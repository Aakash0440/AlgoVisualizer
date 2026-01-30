'use client';

import React, { useState, useCallback, createContext, useContext } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Columns3, Rows3, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Direction = 'horizontal' | 'vertical';

interface SplitLayoutContextValue {
  codeFullscreen: boolean;
  setCodeFullscreen: (v: boolean) => void;
  vizFullscreen: boolean;
  setVizFullscreen: (v: boolean) => void;
}

const SplitLayoutContext = createContext<SplitLayoutContextValue | null>(null);

export function useSplitLayout() {
  return useContext(SplitLayoutContext);
}

interface SplitLayoutProps {
  codePane: React.ReactNode;
  visualizationPane: React.ReactNode;
  className?: string;
  defaultCodeSize?: number;
}

const LAYOUT_DIRECTION_KEY = 'dsa-split-layout-direction';
const DEFAULT_CODE_SIZE = 50;

function getStoredDirection(): Direction {
  if (typeof window === 'undefined') return 'horizontal';
  try {
    const stored = localStorage.getItem(LAYOUT_DIRECTION_KEY);
    if (stored === 'vertical' || stored === 'horizontal') return stored;
  } catch {
    // ignore
  }
  return 'horizontal';
}

export function SplitLayout({
  codePane,
  visualizationPane,
  className,
  defaultCodeSize = DEFAULT_CODE_SIZE,
}: SplitLayoutProps) {
  const [direction, setDirection] = useState<Direction>('horizontal');
  const [codeFullscreen, setCodeFullscreen] = useState(false);
  const [vizFullscreen, setVizFullscreen] = useState(false);

  const toggleDirection = useCallback(() => {
    setDirection((prev) => {
      const next: Direction = prev === 'horizontal' ? 'vertical' : 'horizontal';
      try {
        localStorage.setItem(LAYOUT_DIRECTION_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  React.useEffect(() => {
    setDirection(getStoredDirection());
  }, []);

  const isVertical = direction === 'vertical';
  const contextValue: SplitLayoutContextValue = {
    codeFullscreen,
    setCodeFullscreen,
    vizFullscreen,
    setVizFullscreen,
  };

  return (
    <SplitLayoutContext.Provider value={contextValue}>
      <div className={cn('flex flex-col w-full min-h-[500px]', className)}>
        <div className="flex items-center justify-end gap-2 mb-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDirection}
            className="gap-2"
            title={isVertical ? 'Switch to side-by-side' : 'Switch to stacked'}
            aria-label={isVertical ? 'Horizontal layout' : 'Vertical layout'}
          >
            {isVertical ? (
              <Columns3 className="w-4 h-4" />
            ) : (
              <Rows3 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isVertical ? 'Side by side' : 'Stacked'}
            </span>
          </Button>
        </div>

        {codeFullscreen ? (
          <div className="relative flex-1 min-h-[400px] rounded-lg border border-border overflow-hidden bg-card">
            {codePane}
          </div>
        ) : vizFullscreen ? (
          <div className="relative flex-1 min-h-[400px] rounded-lg border border-border overflow-hidden bg-card">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10 gap-1"
              onClick={() => setVizFullscreen(false)}
              aria-label="Exit fullscreen"
            >
              <X className="w-4 h-4" />
              Exit fullscreen
            </Button>
            <div className="h-full p-2 pt-12 overflow-auto">
              {visualizationPane}
            </div>
          </div>
        ) : (
          <ResizablePanelGroup
            direction={direction}
            className="flex-1 min-h-[500px] rounded-lg border border-border overflow-hidden"
          >
            <ResizablePanel defaultSize={defaultCodeSize} minSize={20} maxSize={80}>
              <div className="h-full p-2 overflow-auto bg-muted/20">
                {codePane}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-border hover:bg-primary/30 transition-colors" />
            <ResizablePanel defaultSize={100 - defaultCodeSize} minSize={20} maxSize={80}>
              <div className="h-full p-2 overflow-auto relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 z-10 gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setVizFullscreen(true)}
                  title="Fullscreen visualization"
                  aria-label="Fullscreen visualization"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Fullscreen</span>
                </Button>
                <div className="pt-8">{visualizationPane}</div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </SplitLayoutContext.Provider>
  );
}
