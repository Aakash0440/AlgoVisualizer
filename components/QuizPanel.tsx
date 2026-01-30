'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AlgorithmStep } from '@/lib/types';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function generateSortingQuizQuestion(
  currentStep: AlgorithmStep,
  nextStep: AlgorithmStep | undefined
): QuizQuestion | null {
  if (!nextStep) return null;
  const indices = currentStep.data?.indices as number[] | undefined;
  const values = currentStep.data?.values as number[] | undefined;
  const a = indices?.[0] != null && values ? values[indices[0]] : null;
  const b = indices?.[1] != null && values ? values[indices[1]] : null;
  const swapped = nextStep.swapped ?? nextStep.action === 'swap';

  const options: string[] = [
    a != null && b != null ? `Swap ${a} and ${b}` : 'Swap the two compared elements',
    'Keep current order, move to next pair',
    'Mark an element as sorted',
    'Array is fully sorted',
  ];

  let correctIndex = 1; // default: move to next pair
  if (nextStep.action === 'swap') correctIndex = 0;
  else if (nextStep.action === 'sorted') correctIndex = 2;
  else if (nextStep.action === 'complete') correctIndex = 3;
  else if (nextStep.action === 'compare') correctIndex = 1;

  return {
    question: 'What will happen next?',
    options,
    correctIndex,
    explanation: nextStep.description || (nextStep.action === 'swap' ? 'Elements are swapped because they are out of order.' : nextStep.action === 'complete' ? 'Sorting is complete.' : 'Comparing the next pair.'),
  };
}

function generateQuizQuestion(
  algorithmCategory: string,
  currentStep: AlgorithmStep,
  nextStep: AlgorithmStep | undefined
): QuizQuestion | null {
  if (algorithmCategory === 'sorting') return generateSortingQuizQuestion(currentStep, nextStep);
  // Generic fallback
  if (!nextStep) return null;
  const actions: Record<string, string> = {
    compare: 'Compare elements',
    swap: 'Swap elements',
    visited: 'Mark as visited',
    sorted: 'Mark as sorted',
    complete: 'Algorithm complete',
    found: 'Element found',
    notFound: 'Element not found',
  };
  const option = actions[nextStep.action] ?? nextStep.description ?? nextStep.action;
  return {
    question: 'What will happen next?',
    options: [option, 'Continue to next step', 'Reset', 'Finish'],
    correctIndex: 0,
    explanation: nextStep.description || nextStep.action,
  };
}

const DEFAULT_HINT_COST_POINTS = 5;

interface QuizPanelProps {
  algorithmCategory: string;
  currentStep: AlgorithmStep | undefined;
  nextStep: AlgorithmStep | undefined;
  onContinue: () => void;
  score: { correct: number; total: number };
  streak: number;
  /** Optional: points (e.g. from parent). Shown when onHintUsed is provided. */
  points?: number;
  /** Called when user uses a hint; parent should deduct points (e.g. hintCost). */
  onHintUsed?: () => void;
  /** Points deducted per hint (default 5). */
  hintCost?: number;
  onAnswerResult: (correct: boolean) => void;
  className?: string;
}

export function QuizPanel({
  algorithmCategory,
  currentStep,
  nextStep,
  onContinue,
  score,
  streak,
  points = 0,
  onHintUsed,
  hintCost = DEFAULT_HINT_COST_POINTS,
  onAnswerResult,
  className,
}: QuizPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  /** Index of one wrong option revealed by hint (costs points). */
  const [revealedWrongIndex, setRevealedWrongIndex] = useState<number | null>(null);

  const quizQuestion = currentStep && nextStep
    ? generateQuizQuestion(algorithmCategory, currentStep, nextStep)
    : null;

  const handleOptionClick = useCallback(
    (index: number) => {
      if (showResult || !quizQuestion) return;
      setSelectedIndex(index);
      setShowResult(true);
      const correct = index === quizQuestion.correctIndex;
      onAnswerResult(correct);
    },
    [showResult, quizQuestion, onAnswerResult]
  );

  const handleContinue = useCallback(() => {
    setSelectedIndex(null);
    setShowResult(false);
    setRevealedWrongIndex(null);
    onContinue();
  }, [onContinue]);

  const handleHint = useCallback(() => {
    if (!quizQuestion || revealedWrongIndex !== null) return;
    const wrongIndices = quizQuestion.options
      .map((_, i) => i)
      .filter((i) => i !== quizQuestion.correctIndex);
    if (wrongIndices.length === 0) return;
    const randomWrong = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    setRevealedWrongIndex(randomWrong);
    onHintUsed?.();
  }, [quizQuestion, revealedWrongIndex, onHintUsed]);

  if (!quizQuestion) return null;

  return (
    <Card className={cn('border-2 border-primary/50 bg-card', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Predict Next Step
          </CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="font-mono">
              Score: {score.correct}/{score.total}
            </Badge>
            {onHintUsed != null && (
              <Badge variant="outline" className="font-mono">
                Points: {points}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              {streak} streak
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-foreground">{quizQuestion.question}</p>
        <div className="grid gap-2">
          {quizQuestion.options.map((option, idx) => {
            const isRevealedWrong = revealedWrongIndex === idx;
            return (
              <Button
                key={idx}
                variant="outline"
                className={cn(
                  'w-full justify-start text-left h-auto py-3 px-4 transition-all',
                  !showResult && !isRevealedWrong && 'hover:border-primary hover:bg-primary/5',
                  showResult && idx === quizQuestion.correctIndex && 'quiz-option-correct border-2',
                  showResult && selectedIndex === idx && idx !== quizQuestion.correctIndex && 'quiz-option-incorrect border-2',
                  isRevealedWrong && 'opacity-60 line-through border-muted-foreground/50 cursor-default'
                )}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult || isRevealedWrong}
              >
                {option}
                {isRevealedWrong && ' (not the answer)'}
              </Button>
            );
          })}
        </div>
        {onHintUsed != null && revealedWrongIndex === null && !showResult && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-amber-600 dark:text-amber-400"
            onClick={handleHint}
            title={`Reveal one wrong option (costs ${hintCost} points)`}
          >
            💡 Reveal wrong option (-{hintCost} pts)
          </Button>
        )}
        {showResult && (
          <div
            className={cn(
              'rounded-lg p-4 border-2',
              selectedIndex === quizQuestion.correctIndex
                ? 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400'
                : 'bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-400'
            )}
          >
            <p className="font-semibold mb-1">
              {selectedIndex === quizQuestion.correctIndex ? '✅ Correct!' : '❌ Incorrect'}
            </p>
            <p className="text-sm opacity-90">{quizQuestion.explanation}</p>
            <Button onClick={handleContinue} className="mt-3" size="sm">
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
