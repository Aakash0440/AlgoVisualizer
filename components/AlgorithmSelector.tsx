'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AlgorithmConfig } from '@/lib/types';

interface AlgorithmSelectorProps {
  algorithms: AlgorithmConfig[];
  selectedId?: string;
  onSelect: (algorithmId: string) => void;
}

const categoryColors: Record<string, string> = {
  sorting: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  searching: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  graph: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
  dp: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
  string: 'bg-pink-500/20 text-pink-700 dark:text-pink-400',
};

export function AlgorithmSelector({
  algorithms,
  selectedId,
  onSelect,
}: AlgorithmSelectorProps) {
  const grouped = algorithms.reduce(
    (acc, algo) => {
      if (!acc[algo.category]) {
        acc[algo.category] = [];
      }
      acc[algo.category].push(algo);
      return acc;
    },
    {} as Record<string, AlgorithmConfig[]>
  );

  const categoryLabels: Record<string, string> = {
    sorting: 'Sorting Algorithms',
    searching: 'Searching Algorithms',
    graph: 'Graph Algorithms',
    dp: 'Dynamic Programming',
    string: 'String Matching',
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, algos]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3 text-foreground">
            {categoryLabels[category]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {algos.map((algo) => (
              <Card
                key={algo.id}
                className={`cursor-pointer transition-all ${
                  selectedId === algo.id
                    ? 'ring-2 ring-algo-active border-algo-active'
                    : 'hover:border-algo-primary'
                }`}
                onClick={() => onSelect(algo.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{algo.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {algo.description}
                      </CardDescription>
                    </div>
                    <Badge className={categoryColors[algo.category]}>
                      {category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <code className="font-mono text-foreground">{algo.timeComplexity}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Space:</span>
                      <code className="font-mono text-foreground">{algo.spaceComplexity}</code>
                    </div>
                  </div>
                  {selectedId === algo.id && (
                    <Button
                      size="sm"
                      className="w-full mt-2 bg-algo-active hover:bg-algo-active/90"
                      disabled
                    >
                      Selected
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
