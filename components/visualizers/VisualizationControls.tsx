'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface VisualizationControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  stepDescription?: string;
}

export function VisualizationControls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  stepDescription,
}: VisualizationControlsProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full space-y-6 bg-gradient-to-br from-card to-card/50 p-6 rounded-xl border border-border/50 shadow-sm">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Progress
            </p>
            <p className="text-lg font-bold text-foreground mt-1">
              Step {currentStep} / {totalSteps}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
          </div>
        </div>
        <div className="w-full bg-background/50 rounded-full h-3 overflow-hidden border border-border/30">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          onClick={onStepBackward}
          disabled={currentStep === 0}
          variant="outline"
          size="lg"
          className="gap-2 hover:bg-primary/10 transition-all bg-transparent"
          title="Previous step"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        {isPlaying ? (
          <Button
            onClick={onPause}
            size="lg"
            className="col-span-2 gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all text-white font-semibold"
            title="Pause animation"
          >
            <Pause className="w-5 h-5" />
            <span>Pause</span>
          </Button>
        ) : (
          <Button
            onClick={onPlay}
            disabled={currentStep === totalSteps}
            size="lg"
            className="col-span-2 gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all disabled:opacity-50 text-white font-semibold"
            title="Play animation"
          >
            <Play className="w-5 h-5" />
            <span>Play</span>
          </Button>
        )}

        <Button
          onClick={onStepForward}
          disabled={currentStep === totalSteps}
          variant="outline"
          size="lg"
          className="gap-2 hover:bg-primary/10 transition-all bg-transparent"
          title="Next step"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Secondary Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={onReset}
          variant="outline"
          size="md"
          className="gap-2 hover:bg-accent/10 bg-transparent"
          title="Reset to start"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>

        <div className="flex gap-2 items-center justify-end">
          <span className="text-xs text-muted-foreground font-semibold">Speed:</span>
          <span className="font-mono font-bold text-primary">{speed}x</span>
        </div>
      </div>

      {/* Speed Controls */}
      <div className="grid grid-cols-4 gap-2">
        {[0.25, 0.5, 1, 2].map((s) => (
          <Button
            key={s}
            variant={speed === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSpeedChange(s)}
            className={`text-xs font-semibold transition-all ${
              speed === s
                ? 'bg-gradient-to-r from-primary to-accent text-white'
                : 'hover:bg-primary/5'
            }`}
            title={`Set speed to ${s}x`}
          >
            {s}x
          </Button>
        ))}
      </div>

      {/* Step Description */}
      {stepDescription && (
        <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 dark:from-blue-950/20 dark:to-blue-950/10 border border-blue-200/50 dark:border-blue-800/30 rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
            Current Action
          </p>
          <p className="text-sm font-medium text-foreground">{stepDescription}</p>
        </div>
      )}
    </div>
  );
}
