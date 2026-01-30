'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VisualizationControls } from './visualizers/VisualizationControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AlgorithmStep } from '@/lib/types';

interface StringVisualizerProps {
  algorithmName: string;
  algorithmGenerator: (text: string, pattern: string) => AlgorithmStep[];
}

export function StringVisualizer({
  algorithmName,
  algorithmGenerator,
}: StringVisualizerProps) {
  const [text, setText] = useState('ABCCDDEFF');
  const [pattern, setPattern] = useState('CDD');
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [textHighlight, setTextHighlight] = useState<number[]>([]);
  const [patternHighlight, setPatternHighlight] = useState<number[]>([]);
  const [result, setResult] = useState<string>('');
  const [stepDescription, setStepDescription] = useState('');

  // Generate steps
  useEffect(() => {
    const newSteps = algorithmGenerator(text.toUpperCase(), pattern.toUpperCase());
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setTextHighlight([]);
    setPatternHighlight([]);
    setResult('');
    setStepDescription('');
  }, [text, pattern, algorithmGenerator]);

  // Process current step
  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      setStepDescription(step.description || '');

      switch (step.action) {
        case 'charMatch':
          setTextHighlight([step.data?.textIndex]);
          setPatternHighlight([step.data?.patternIndex]);
          break;

        case 'mismatch':
          setTextHighlight([step.data?.textIndex]);
          setPatternHighlight([step.data?.patternIndex]);
          break;

        case 'found':
          setResult(`Pattern found at index ${step.data?.index}`);
          setIsPlaying(false);
          break;

        case 'notFound':
          setResult('Pattern not found');
          setIsPlaying(false);
          break;

        case 'start':
          setTextHighlight([]);
          setPatternHighlight([]);
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
    setTextHighlight([]);
    setPatternHighlight([]);
    setResult('');
    setStepDescription('');
  }, []);

  const handleSearch = useCallback(() => {
    handleReset();
    const newSteps = algorithmGenerator(text.toUpperCase(), pattern.toUpperCase());
    setSteps(newSteps);
  }, [text, pattern, algorithmGenerator, handleReset]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{algorithmName}</CardTitle>
          <CardDescription>
            Step-by-step visualization of pattern matching in strings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Text</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                placeholder="Enter text to search in"
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Pattern</label>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value.toUpperCase())}
                placeholder="Enter pattern to find"
                className="font-mono"
              />
            </div>
          </div>

          <Button onClick={handleSearch} className="bg-algo-active hover:bg-algo-active/90">
            Search
          </Button>

          {/* Text Visualization */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Text
              </label>
              <div className="flex gap-1 font-mono text-lg">
                {text.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`
                      flex items-center justify-center w-8 h-8 rounded border-2
                      transition-all font-bold
                      ${
                        textHighlight.includes(idx)
                          ? 'border-red-400 bg-red-500/20'
                          : 'border-algo-primary bg-background'
                      }
                    `}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Pattern
              </label>
              <div className="flex gap-1 font-mono text-lg">
                {pattern.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`
                      flex items-center justify-center w-8 h-8 rounded border-2
                      transition-all font-bold
                      ${
                        patternHighlight.includes(idx)
                          ? 'border-red-400 bg-red-500/20'
                          : 'border-algo-visited bg-background'
                      }
                    `}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {result && (
            <div
              className={`p-3 rounded text-sm font-mono ${
                result.includes('found')
                  ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 dark:text-red-400'
              }`}
            >
              {result}
            </div>
          )}

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
        </CardContent>
      </Card>
    </div>
  );
}
