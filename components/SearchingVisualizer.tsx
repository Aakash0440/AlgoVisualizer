'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrayVisualizer } from './visualizers/ArrayVisualizer';
import { VisualizationControls } from './visualizers/VisualizationControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { generateRandomArray } from '@/lib/algorithms/engine';
import type { AlgorithmStep } from '@/lib/types';

interface SearchingVisualizerProps {
  algorithmName: string;
  algorithmGenerator: (arr: number[], target: number) => AlgorithmStep[];
  initialArray?: number[];
  arraySize?: number;
}

export function SearchingVisualizer({
  algorithmName,
  algorithmGenerator,
  initialArray,
  arraySize = 30,
}: SearchingVisualizerProps) {
  const [array, setArray] = useState<number[]>(
    initialArray ? initialArray.sort((a, b) => a - b) : generateRandomArray(arraySize).sort((a, b) => a - b)
  );
  const [target, setTarget] = useState(array[Math.floor(array.length / 2)]);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [comparing, setComparing] = useState<number[]>([]);
  const [visited, setVisited] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [stepDescription, setStepDescription] = useState('');

  // Generate steps for the algorithm
  useEffect(() => {
    const newSteps = algorithmGenerator(array, target);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setComparing([]);
    setVisited([]);
    setFoundIndex(null);
    setStepDescription('');
  }, [array, target, algorithmGenerator]);

  // Process current step
  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      setStepDescription(step.description || '');

      switch (step.action) {
        case 'compare':
        case 'checkEdge':
          setComparing(step.data?.indices || [step.data?.index].filter(Boolean) || []);
          break;

        case 'visited':
          setVisited((prev) => [...new Set([...prev, step.data?.index])]);
          setComparing([]);
          break;

        case 'found':
          setFoundIndex(step.data?.index);
          setComparing([]);
          setIsPlaying(false);
          break;

        case 'notFound':
          setFoundIndex(-1);
          setComparing([]);
          setIsPlaying(false);
          break;

        case 'complete':
          setComparing([]);
          setIsPlaying(false);
          break;
      }
    }
  }, [currentStep, steps]);

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
    setVisited([]);
    setFoundIndex(null);
    setStepDescription('');
  }, []);

  const handleGenerateNew = useCallback(() => {
    const newArray = generateRandomArray(arraySize).sort((a, b) => a - b);
    setArray(newArray);
    setTarget(newArray[Math.floor(newArray.length / 2)]);
    handleReset();
  }, [arraySize, handleReset]);

  const handleSearch = useCallback(() => {
    handleReset();
    const newSteps = algorithmGenerator(array, target);
    setSteps(newSteps);
  }, [array, target, algorithmGenerator, handleReset]);

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
              placeholder="Enter target value"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="max-w-xs"
            />
            <Button onClick={handleSearch} className="bg-algo-active hover:bg-algo-active/90">
              Search
            </Button>
          </div>

          {foundIndex !== null && (
            <div
              className={`p-3 rounded text-sm ${
                foundIndex >= 0
                  ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 dark:text-red-400'
              }`}
            >
              {foundIndex >= 0 ? `Found at index ${foundIndex}` : 'Value not found in array'}
            </div>
          )}

          <ArrayVisualizer
            values={array}
            comparing={comparing}
            visited={visited}
            maxValue={Math.max(...array)}
          />

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

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handleGenerateNew}>
              New Array
            </Button>
            <div className="flex gap-1">
              {[10, 20, 30, 50].map((size) => (
                <Button
                  key={size}
                  variant={arraySize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const newArray = generateRandomArray(size).sort((a, b) => a - b);
                    setArray(newArray);
                    setTarget(newArray[Math.floor(newArray.length / 2)]);
                    handleReset();
                  }}
                >
                  {size} items
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
