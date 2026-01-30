'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Brain, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AlgorithmStep } from '@/lib/types';

const EXPLANATION_CACHE_KEY_PREFIX = 'dsa-ai-explanation-';

interface AIExplainerProps {
  algorithmName: string;
  algorithmId?: string;
  currentStep: AlgorithmStep | undefined;
  stepIndex: number;
  totalSteps: number;
  className?: string;
}

function getCacheKey(algorithmId: string, stepIndex: number): string {
  return `${EXPLANATION_CACHE_KEY_PREFIX}${algorithmId}-${stepIndex}`;
}

function getCachedExplanation(algorithmId: string, stepIndex: number): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(getCacheKey(algorithmId, stepIndex));
  } catch {
    return null;
  }
}

function setCachedExplanation(
  algorithmId: string,
  stepIndex: number,
  explanation: string
): void {
  try {
    localStorage.setItem(getCacheKey(algorithmId, stepIndex), explanation);
  } catch {
    // ignore
  }
}

export function AIExplainer({
  algorithmName,
  algorithmId = 'unknown',
  currentStep,
  stepIndex,
  totalSteps,
  className,
}: AIExplainerProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'advanced'>('beginner');
  const [showFollowUp, setShowFollowUp] = useState(false);

  const explainCurrentStep = useCallback(async () => {
    if (!currentStep) return;
    const cached = getCachedExplanation(algorithmId, stepIndex);
    if (cached) {
      setExplanation(cached);
      return;
    }
    setLoading(true);
    setExplanation('');
    try {
      const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
      const body = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a DSA tutor. Explain this algorithm step clearly and concisely.

Algorithm: ${algorithmName}
Current Step: ${stepIndex + 1} of ${totalSteps}
Array State: ${currentStep.data?.values ? JSON.stringify(currentStep.data.values) : 'N/A'}
Highlighted/Compared Indices: ${currentStep.data?.indices ? JSON.stringify(currentStep.data.indices) : 'N/A'}
Action: ${currentStep.description || currentStep.action}
${currentStep.swapped ? 'Elements were swapped.' : 'No swap occurred.'}

Explain:
1. What just happened in this step
2. WHY this action was taken (the logic behind it)
3. What to expect in the next step
4. Key insight for understanding this algorithm

Keep it clear and educational. Use simple language.`,
          },
        ],
      };
      if (!apiKey) {
        setExplanation(
          'AI explanations require an API key. Set NEXT_PUBLIC_ANTHROPIC_API_KEY in your environment, or use the cached explanation if you have one.'
        );
        setLoading(false);
        return;
      }
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.text();
        setExplanation(`Failed to load explanation: ${response.status}. ${err.slice(0, 200)}`);
        setLoading(false);
        return;
      }
      const data = (await response.json()) as {
        content?: { type: string; text?: string }[];
      };
      const text =
        data.content?.find((c) => c.type === 'text')?.text ?? 'Unable to generate explanation.';
      setExplanation(text);
      setCachedExplanation(algorithmId, stepIndex, text);
    } catch (error) {
      setExplanation(
        `Failed to load explanation. ${error instanceof Error ? error.message : 'Please try again.'}`
      );
    } finally {
      setLoading(false);
    }
  }, [algorithmName, algorithmId, currentStep, stepIndex, totalSteps]);

  return (
    <div className={cn('space-y-2', className)}>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={explainCurrentStep}
        disabled={loading || !currentStep}
        aria-label="Explain this step with AI"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Brain className="w-4 h-4" />
        )}
        {loading ? 'Generating...' : 'Explain This Step'}
      </Button>
      {explanation && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              AI Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm whitespace-pre-wrap text-foreground/90">{explanation}</div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <Select
                value={explanationLevel}
                onValueChange={(v) => setExplanationLevel(v as 'beginner' | 'advanced')}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setShowFollowUp(!showFollowUp)}
              >
                Ask follow-up
              </Button>
            </div>
            {showFollowUp && (
              <div className="space-y-2 pt-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                <p>
                  <strong>Ask follow-up:</strong> In a future update you’ll be able to type a
                  follow-up question and get another AI response. For now, use “Explain This Step”
                  again on a different step or re-run to get a fresh explanation.
                </p>
                <Button variant="ghost" size="sm" onClick={() => setShowFollowUp(false)}>
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
