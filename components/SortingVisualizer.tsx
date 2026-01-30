'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrayVisualizer } from './visualizers/ArrayVisualizer';
import { VisualizationControls } from './visualizers/VisualizationControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRandomArray } from '@/lib/algorithms/engine';
import type { AlgorithmStep } from '@/lib/types';

interface SortingVisualizerProps {
  algorithmName: string;
  algorithmGenerator: (arr: number[]) => AlgorithmStep[];
  initialArray?: number[];
  arraySize?: number;
}

export function SortingVisualizer({
  algorithmName,
  algorithmGenerator,
  initialArray,
  arraySize = 30,
}: SortingVisualizerProps) {
  const [array, setArray] = useState<number[]>(initialArray || generateRandomArray(arraySize));
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [comparing, setComparing] = useState<number[]>([]);
  const [compared, setCompared] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [visited, setVisited] = useState<number[]>([]);
  const [stepDescription, setStepDescription] = useState('');

  // Generate steps for the algorithm
  useEffect(() => {
    const newSteps = algorithmGenerator(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setComparing([]);
    setCompared([]);
    setSorted([]);
    setVisited([]);
    setStepDescription('');
  }, [array, algorithmGenerator]);

  // Process current step
  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];

      setStepDescription(step.description || '');

      switch (step.action) {
        case 'compare':
          setComparing(step.data?.indices || []);
          setCompared([]);
          break;

        case 'swap':
          if (step.data?.values) {
            setArray([...step.data.values]);
          }
          setComparing([]);
          setCompared(step.data?.indices || []);
          break;

        case 'visited':
          setVisited((prev) => [...new Set([...prev, step.data?.index])]);
          setComparing([]);
          break;

        case 'sorted':
          setSorted((prev) => [...new Set([...prev, step.data?.index])]);
          setVisited([]);
          setCompared([]);
          break;

        case 'complete':
          if (step.data?.values) {
            setArray([...step.data.values]);
          }
          setSorted(Array.from({ length: array.length }, (_, i) => i));
          setComparing([]);
          setCompared([]);
          setIsPlaying(false);
          break;
      }
    }
  }, [currentStep, steps, array.length]);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) return;

    const interval = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }, 500 / speed);

    return () => clearTimeout(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setComparing([]);
    setCompared([]);
    setSorted([]);
    setVisited([]);
    setStepDescription('');
  }, []);

  const handleGenerateNew = useCallback(() => {
    setArray(generateRandomArray(arraySize));
    handleReset();
  }, [arraySize, handleReset]);

  const handleArraySizeChange = (size: number) => {
    setArray(generateRandomArray(size));
    handleReset();
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
          <CardTitle className="text-2xl">{algorithmName}</CardTitle>
          <CardDescription className="text-base">
            Step-by-step visualization of the {algorithmName} algorithm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-8">
          <div className="bg-card border border-border/50 rounded-lg p-8 min-h-96 flex items-center justify-center">
            <ArrayVisualizer
              values={array}
              comparing={comparing}
              compared={compared}
              sorted={sorted}
              visited={visited}
            />
          </div>

          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Current Step</p>
            <p className="font-medium text-foreground">{stepDescription || 'Ready to start'}</p>
          </div>

          <VisualizationControls
            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={steps.length}
            speed={speed}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={handleReset}
            onStepForward={() =>
              setCurrentStep((prev) => Math.min(prev + 1, steps.length))
            }
            onStepBackward={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            onSpeedChange={setSpeed}
            stepDescription={stepDescription}
          />

          <div className="space-y-3 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              onClick={handleGenerateNew}
              className="w-full hover:bg-primary/5 bg-transparent"
            >
              🔀 Shuffle Array
            </Button>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 50].map((size) => (
                <Button
                  key={size}
                  variant={arraySize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleArraySizeChange(size)}
                  className="transition-all"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
