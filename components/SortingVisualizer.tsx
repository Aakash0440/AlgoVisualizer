'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrayVisualizer } from './visualizers/ArrayVisualizer';
import { VisualizationControls } from './visualizers/VisualizationControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRandomArray } from '@/lib/algorithms/engine';
import { getStoredSpeed } from '@/components/SpeedControl';
import { SplitLayout } from '@/components/SplitLayout';
import { CodePane } from '@/components/CodePane';
import { QuizPanel } from '@/components/QuizPanel';
import { AIExplainer } from '@/components/AIExplainer';
import type { AlgorithmStep } from '@/lib/types';

type ViewMode = 'learn' | 'quiz';

interface SortingVisualizerProps {
  algorithmName: string;
  algorithmId?: string;
  algorithmCategory?: string;
  algorithmGenerator: (arr: number[]) => AlgorithmStep[];
  initialArray?: number[];
  arraySize?: number;
}

export function SortingVisualizer({
  algorithmName,
  algorithmId,
  algorithmCategory = 'sorting',
  algorithmGenerator,
  initialArray,
  arraySize = 30,
}: SortingVisualizerProps) {
  const [array, setArray] = useState<number[]>(initialArray || generateRandomArray(arraySize));
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1000);
  const [mode, setMode] = useState<ViewMode>('learn');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(100); // Start with 100; hints cost points
  useEffect(() => {
    setSpeedMs(getStoredSpeed());
  }, []);

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

  // Auto-play effect: speed in ms per step (skip when in quiz mode)
  useEffect(() => {
    if (mode === 'quiz' || !isPlaying || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }, speedMs);

    return () => clearTimeout(timer);
  }, [mode, isPlaying, currentStep, steps.length, speedMs]);

  // Keyboard shortcuts: Space = play/pause, Arrow keys = step
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying((p) => !p);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentStep((prev) => Math.min(prev + 1, steps.length));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentStep((prev) => Math.max(prev - 1, 0));
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setComparing([]);
    setCompared([]);
    setSorted([]);
    setVisited([]);
    setStepDescription('');
    setPoints(100);
  }, []);

  const handleQuizAnswerResult = useCallback((correct: boolean) => {
    setScore((prev) => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    setStreak((prev) => (correct ? prev + 1 : 0));
    if (correct) setPoints((p) => Math.max(0, p + 10)); // +10 pts per correct
    else setPoints((p) => Math.max(0, p - 5)); // -5 pts per wrong
  }, []);

  const QUIZ_HINT_COST = 5;
  const handleQuizHintUsed = useCallback(() => {
    setPoints((p) => Math.max(0, p - QUIZ_HINT_COST));
  }, []);

  const handleQuizContinue = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  }, [steps.length]);

  const handleGenerateNew = useCallback(() => {
    setArray(generateRandomArray(arraySize));
    handleReset();
  }, [arraySize, handleReset]);

  const handleArraySizeChange = (size: number) => {
    setArray(generateRandomArray(size));
    handleReset();
  };

  const currentLine = steps[currentStep]?.codeLine ?? null;
  const showSplitLayout = !!algorithmId;

  const visualizationContent = (
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

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={mode === 'quiz' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode((m) => (m === 'quiz' ? 'learn' : 'quiz'))}
              className="gap-2"
            >
              🧠 Quiz Mode
            </Button>
          </div>

          {mode === 'quiz' && currentStep < steps.length - 1 && (
            <QuizPanel
              algorithmCategory={algorithmCategory}
              currentStep={steps[currentStep]}
              nextStep={steps[currentStep + 1]}
              onContinue={handleQuizContinue}
              score={score}
              streak={streak}
              points={points}
              onHintUsed={handleQuizHintUsed}
              hintCost={QUIZ_HINT_COST}
              onAnswerResult={handleQuizAnswerResult}
            />
          )}

          <AIExplainer
            algorithmName={algorithmName}
            algorithmId={algorithmId ?? 'sorting'}
            currentStep={steps[currentStep]}
            stepIndex={currentStep}
            totalSteps={steps.length}
          />

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

  if (showSplitLayout) {
    return (
      <div className="space-y-6">
        <SplitLayout
          codePane={
            <CodePane
              algorithmId={algorithmId}
              currentLine={currentLine}
              className="h-full min-h-[300px]"
            />
          }
          visualizationPane={visualizationContent}
          defaultCodeSize={50}
        />
      </div>
    );
  }

  return <div className="space-y-6">{visualizationContent}</div>;
}
