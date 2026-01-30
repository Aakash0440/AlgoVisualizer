'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  INTERVIEW_PROBLEMS,
  getInterviewProblemsByDifficulty,
  type InterviewProblem,
} from '@/lib/interviewProblems';
import { Lightbulb, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface InterviewModeProps {
  onBack?: () => void;
  className?: string;
}

export function InterviewMode({ onBack, className }: InterviewModeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const problem = selectedId ? INTERVIEW_PROBLEMS[selectedId] ?? null : null;
  const problems = getInterviewProblemsByDifficulty(
    difficultyFilter === 'all' ? undefined : (difficultyFilter as 'Easy' | 'Medium' | 'Hard')
  );

  useEffect(() => {
    if (!timerStarted) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStarted]);

  const startTimer = useCallback(() => setTimerStarted(true), []);
  const showNextHint = useCallback(() => {
    if (!problem) return;
    setHintIndex((prev) => Math.min(prev + 1, problem.hints.length));
  }, [problem]);

  const resetProblem = useCallback(() => {
    setShowHints(false);
    setHintIndex(0);
    setShowSolution(false);
    setTimerStarted(false);
    setTimeElapsed(0);
  }, []);

  useEffect(() => {
    resetProblem();
  }, [selectedId, resetProblem]);

  return (
    <div className={cn('space-y-6', className)}>
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="gap-2">
          ← Back
        </Button>
      )}

      {!problem ? (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-4">DSA for Interviews</h2>
            <p className="text-muted-foreground mb-4">
              Practice real interview problems from top companies. Select a problem and simulate
              interview pressure with a timer.
            </p>
            <div className="flex gap-4 items-center flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {problems.map((p) => (
              <Card
                key={p.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedId(p.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <Badge
                      className={cn(
                        p.difficulty === 'Easy' && 'bg-green-500/20 text-green-700 dark:text-green-400',
                        p.difficulty === 'Medium' && 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
                        p.difficulty === 'Hard' && 'bg-red-500/20 text-red-700 dark:text-red-400'
                      )}
                    >
                      {p.difficulty}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.companies.slice(0, 4).map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>{problem.name}</CardTitle>
                <CardDescription className="mt-1">{problem.description}</CardDescription>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  className={cn(
                    problem.difficulty === 'Easy' && 'bg-green-500/20 text-green-700 dark:text-green-400',
                    problem.difficulty === 'Medium' && 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
                    problem.difficulty === 'Hard' && 'bg-red-500/20 text-red-700 dark:text-red-400'
                  )}
                >
                  {problem.difficulty}
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime(timeElapsed)}</span>
                  {!timerStarted && (
                    <Button size="sm" variant="outline" onClick={startTimer}>
                      Start timer
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {problem.companies.map((c) => (
                <Badge key={c} variant="secondary">
                  {c}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <section>
              <h3 className="font-semibold mb-2">Examples</h3>
              {problem.examples.map((ex, i) => (
                <div key={i} className="rounded-lg border bg-muted/30 p-4 mb-3">
                  <p className="text-sm">
                    <strong>Input:</strong> {ex.input}
                  </p>
                  <p className="text-sm">
                    <strong>Output:</strong> {ex.output}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Explanation:</strong> {ex.explanation}
                  </p>
                </div>
              ))}
            </section>
            <section>
              <h3 className="font-semibold mb-2">Constraints</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
            <div className="flex gap-2 flex-wrap pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setShowHints(true);
                  showNextHint();
                }}
              >
                <Lightbulb className="w-4 h-4" />
                {showHints ? `Hint ${hintIndex + 1}` : 'Show hints'}
              </Button>
              {showHints && hintIndex < problem.hints.length && (
                <Button variant="outline" size="sm" onClick={showNextHint}>
                  Next hint
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowSolution(true)}
              >
                <CheckCircle2 className="w-4 h-4" />
                Show solution
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                Change problem
              </Button>
            </div>
            {showHints && problem.hints.length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </h4>
                <ul className="list-decimal list-inside text-sm space-y-1">
                  {problem.hints.slice(0, hintIndex + 1).map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
            {showSolution && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Optimal solution
                </h4>
                <p className="text-sm whitespace-pre-wrap">{problem.optimalSolution}</p>
                {problem.similarProblems.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Similar:</strong> {problem.similarProblems.join(', ')}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
