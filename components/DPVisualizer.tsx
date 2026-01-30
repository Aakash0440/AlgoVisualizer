'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VisualizationControls } from './visualizers/VisualizationControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getStoredSpeed } from '@/components/SpeedControl';
import type { AlgorithmStep } from '@/lib/types';

interface DPVisualizerProps {
  algorithmName: string;
  algorithmGenerator: (n: number) => AlgorithmStep[];
}

export function DPVisualizer({
  algorithmName,
  algorithmGenerator,
}: DPVisualizerProps) {
  const [n, setN] = useState(10);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1000);
  useEffect(() => {
    setSpeedMs(getStoredSpeed());
  }, []);

  const [dpTable, setDpTable] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [result, setResult] = useState<string>('');
  const [stepDescription, setStepDescription] = useState('');

  // Generate steps
  useEffect(() => {
    const newSteps = algorithmGenerator(n);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setDpTable([]);
    setCurrentIndex(null);
    setResult('');
    setStepDescription('');
  }, [n, algorithmGenerator]);

  // Process current step
  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      setStepDescription(step.description || '');

      switch (step.action) {
        case 'initialize':
          setDpTable([]);
          setCurrentIndex(null);
          break;

        case 'baseCase':
          setDpTable((prev) => {
            const newTable = [...prev];
            newTable[step.data?.index] = step.data?.value;
            return newTable;
          });
          setCurrentIndex(step.data?.index);
          break;

        case 'compute':
          setDpTable((prev) => {
            const newTable = [...prev];
            newTable[step.data?.index] = step.data?.value;
            return newTable;
          });
          setCurrentIndex(step.data?.index);
          break;

        case 'checkCell':
          setCurrentIndex(null);
          break;

        case 'updateCell':
          setDpTable((prev) => {
            const newTable = [...prev];
            newTable[step.data?.item] = step.data?.value;
            return newTable;
          });
          setCurrentIndex(step.data?.item);
          break;

        case 'complete':
          setResult(
            step.data?.result !== undefined
              ? `Result: ${step.data.result}`
              : `Max Value: ${step.data?.maxValue}`
          );
          setIsPlaying(false);
          break;
      }
    }
  }, [currentStep, steps]);

  // Auto-play effect (speed in ms per step)
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }, speedMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speedMs]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setDpTable([]);
    setCurrentIndex(null);
    setResult('');
    setStepDescription('');
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{algorithmName}</CardTitle>
          <CardDescription>
            Step-by-step visualization of the {algorithmName} algorithm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              max="20"
              value={n}
              onChange={(e) => {
                setN(Number(e.target.value));
                handleReset();
              }}
              className="max-w-xs"
            />
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>

          {/* DP Table Visualization */}
          <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {dpTable.map((value, idx) => (
                <div
                  key={idx}
                  className={`
                    flex items-center justify-center
                    w-12 h-12 rounded border-2 font-mono text-sm font-bold
                    transition-all
                    ${
                      idx === currentIndex
                        ? 'border-red-400 bg-red-500/20'
                        : 'border-algo-primary bg-algo-primary/10'
                    }
                  `}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          {result && (
            <div className="p-3 rounded bg-green-500/20 text-green-700 dark:text-green-400 text-sm font-mono">
              {result}
            </div>
          )}

          <VisualizationControls
            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={steps.length}
            speedMs={speedMs}
            onSpeedMsChange={(ms) => {
              setSpeedMs(ms);
              try {
                localStorage.setItem('dsa-visualizer-speed-ms', String(ms));
              } catch {
                // ignore
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={handleReset}
            onStepForward={() =>
              setCurrentStep((prev) => Math.min(prev + 1, steps.length))
            }
            onStepBackward={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            stepDescription={stepDescription}
          />
        </CardContent>
      </Card>
    </div>
  );
}
