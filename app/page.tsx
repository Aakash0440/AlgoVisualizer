'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { SortingVisualizer } from '@/components/SortingVisualizer';
import { SearchingVisualizer } from '@/components/SearchingVisualizer';
import { GraphVisualizer } from '@/components/GraphVisualizer';
import { DPVisualizer } from '@/components/DPVisualizer';
import { StringVisualizer } from '@/components/StringVisualizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, BookOpen, Grid3x3, Brain, Type, ChevronRight, Briefcase } from 'lucide-react';
import { InterviewMode } from '@/components/InterviewMode';

import { createBubbleSort } from '@/lib/algorithms/sorting/bubbleSort';
import { createMergeSort } from '@/lib/algorithms/sorting/mergeSort';
import { createHeapSort } from '@/lib/algorithms/sorting/heapSort';
import { createLinearSearch } from '@/lib/algorithms/searching/linearSearch';
import { createBinarySearch } from '@/lib/algorithms/searching/binarySearch';
import { createBFS } from '@/lib/algorithms/graph/bfs';
import { createDFS } from '@/lib/algorithms/graph/dfs';
import { createDijkstra } from '@/lib/algorithms/graph/dijkstra';
import { createFibonacciDP } from '@/lib/algorithms/dp/fibonacci';
import { createKnapsackDP } from '@/lib/algorithms/dp/knapsack';
import { createKMP } from '@/lib/algorithms/string/kmp';

import type { AlgorithmConfig } from '@/lib/types';

const algorithms: AlgorithmConfig[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'Repeatedly swaps adjacent elements if in wrong order',
    inputType: 'array',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'Divide and conquer approach with stable sorting',
    inputType: 'array',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    description: 'Uses heap data structure for efficient sorting',
    inputType: 'array',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    description: 'Sequentially searches through array elements',
    inputType: 'array',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    description: 'Efficient search on sorted arrays using divide & conquer',
    inputType: 'array',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'bfs',
    name: 'BFS',
    category: 'graph',
    description: 'Explores graph level by level using queue',
    inputType: 'graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'dfs',
    name: 'DFS',
    category: 'graph',
    description: 'Explores graph deeply using recursion/stack',
    inputType: 'graph',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    description: 'Finds shortest path in weighted graph',
    inputType: 'graph',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci (DP)',
    category: 'dp',
    description: 'Dynamic programming approach to Fibonacci sequence',
    inputType: 'number',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'dp',
    description: 'Optimize item selection with weight constraint',
    inputType: 'number',
    timeComplexity: 'O(nW)',
    spaceComplexity: 'O(nW)',
  },
  {
    id: 'kmp',
    name: 'KMP String Matching',
    category: 'string',
    description: 'Efficient pattern matching in text',
    inputType: 'string',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(m)',
  },
];

function PageContent() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [showHome, setShowHome] = useState(true);
  const [showInterviewMode, setShowInterviewMode] = useState(false);
  const searchParams = useSearchParams();
  const categoryFilter = searchParams?.get('category');
  const modeParam = searchParams?.get('mode');
  React.useEffect(() => {
    if (modeParam === 'interview') setShowInterviewMode(true);
  }, [modeParam]);

  const selected = algorithms.find((a) => a.id === selectedAlgorithm);

  const filteredAlgorithms = categoryFilter
    ? algorithms.filter((a) => a.category === categoryFilter)
    : algorithms;

  const categories = [
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      icon: BookOpen,
      color: 'from-accent to-orange-500',
      description: 'Learn how different sorting algorithms work',
      count: algorithms.filter((a) => a.category === 'sorting').length,
    },
    {
      id: 'searching',
      name: 'Searching Algorithms',
      icon: Grid3x3,
      color: 'from-primary to-blue-500',
      description: 'Explore searching techniques',
      count: algorithms.filter((a) => a.category === 'searching').length,
    },
    {
      id: 'graph',
      name: 'Graph Algorithms',
      icon: Grid3x3,
      color: 'from-purple-500 to-pink-500',
      description: 'Traverse and analyze graphs',
      count: algorithms.filter((a) => a.category === 'graph').length,
    },
    {
      id: 'dp',
      name: 'Dynamic Programming',
      icon: Brain,
      color: 'from-green-500 to-teal-500',
      description: 'Solve optimization problems',
      count: algorithms.filter((a) => a.category === 'dp').length,
    },
    {
      id: 'string',
      name: 'String Matching',
      icon: Type,
      color: 'from-red-500 to-pink-500',
      description: 'Pattern matching algorithms',
      count: algorithms.filter((a) => a.category === 'string').length,
    },
  ];

  const renderVisualizer = () => {
    switch (selectedAlgorithm) {
      case 'bubble-sort':
        return (
          <SortingVisualizer
            algorithmName="Bubble Sort"
            algorithmId="bubble-sort"
            algorithmCategory="sorting"
            algorithmGenerator={(arr) => {
              const algo = createBubbleSort();
              algo.sort(arr);
              return algo.getSteps();
            }}
          />
        );

      case 'merge-sort':
        return (
          <SortingVisualizer
            algorithmName="Merge Sort"
            algorithmId="merge-sort"
            algorithmCategory="sorting"
            algorithmGenerator={(arr) => {
              const algo = createMergeSort();
              algo.sort(arr);
              return algo.getSteps();
            }}
          />
        );

      case 'heap-sort':
        return (
          <SortingVisualizer
            algorithmName="Heap Sort"
            algorithmId="heap-sort"
            algorithmCategory="sorting"
            algorithmGenerator={(arr) => {
              const algo = createHeapSort();
              algo.sort(arr);
              return algo.getSteps();
            }}
          />
        );

      case 'linear-search':
        return (
          <SearchingVisualizer
            algorithmName="Linear Search"
            algorithmGenerator={(arr, target) => {
              const algo = createLinearSearch();
              algo.search(arr, target);
              return algo.getSteps();
            }}
          />
        );

      case 'binary-search':
        return (
          <SearchingVisualizer
            algorithmName="Binary Search"
            algorithmGenerator={(arr, target) => {
              const algo = createBinarySearch();
              algo.search(arr, target);
              return algo.getSteps();
            }}
          />
        );

      case 'bfs':
        return (
          <GraphVisualizer
            algorithmName="Breadth-First Search"
            algorithmGenerator={(nodes, edges, start) => {
              const algo = createBFS();
              algo.traverse(nodes, edges, start);
              return algo.getSteps();
            }}
          />
        );

      case 'dfs':
        return (
          <GraphVisualizer
            algorithmName="Depth-First Search"
            algorithmGenerator={(nodes, edges, start) => {
              const algo = createDFS();
              algo.traverse(nodes, edges, start);
              return algo.getSteps();
            }}
          />
        );

      case 'dijkstra':
        return (
          <GraphVisualizer
            algorithmName="Dijkstra's Algorithm"
            algorithmGenerator={(nodes, edges, start) => {
              const algo = createDijkstra();
              algo.findShortestPath(nodes, edges, start);
              return algo.getSteps();
            }}
          />
        );

      case 'fibonacci':
        return (
          <DPVisualizer
            algorithmName="Fibonacci (Dynamic Programming)"
            algorithmGenerator={(n) => {
              const algo = createFibonacciDP();
              algo.compute(n);
              return algo.getSteps();
            }}
          />
        );

      case 'knapsack':
        return (
          <DPVisualizer
            algorithmName="0/1 Knapsack Problem"
            algorithmGenerator={(n) => {
              const algo = createKnapsackDP();
              algo.solve([2, 3, 4, 5], [3, 4, 5, 6], n || 10);
              return algo.getSteps();
            }}
          />
        );

      case 'kmp':
        return (
          <StringVisualizer
            algorithmName="KMP String Matching"
            algorithmGenerator={(text, pattern) => {
              const algo = createKMP();
              algo.search(text, pattern);
              return algo.getSteps();
            }}
          />
        );

      default:
        return null;
    }
  };

  if (showInterviewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <InterviewMode onBack={() => setShowInterviewMode(false)} />
        </div>
      </div>
    );
  }

  if (selectedAlgorithm && !showHome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedAlgorithm(null)}
            className="mb-6 gap-2"
          >
            ← Back to Algorithms
          </Button>
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {selected?.name}
              </h1>
              <p className="text-lg text-muted-foreground">{selected?.description}</p>
              <div className="flex gap-4 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Time Complexity</span>
                  <Badge className="w-fit bg-primary/20 text-primary border-primary/40">
                    {selected?.timeComplexity}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Space Complexity</span>
                  <Badge className="w-fit bg-accent/20 text-accent border-accent/40">
                    {selected?.spaceComplexity}
                  </Badge>
                </div>
              </div>
            </div>

            {renderVisualizer()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Interactive Learning Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary leading-tight">
            Master Algorithms Visually
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understand how algorithms work with step-by-step visualization. From sorting to dynamic programming, 
            learn by seeing the process unfold.
          </p>

          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow"
            onClick={() => setShowHome(false)}
          >
            Start Learning <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Explore Algorithm Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-0 overflow-hidden"
                  onClick={() => {
                    const algo = algorithms.find((a) => a.category === category.id);
                    if (algo) {
                      setSelectedAlgorithm(algo.id);
                      setShowHome(false);
                    }
                  }}
                >
                  <div
                    className={`h-20 bg-gradient-to-r ${category.color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 opacity-20">
                      <Icon className="w-12 h-12 absolute bottom-2 right-2 text-white" />
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{category.count} algorithms</Badge>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Algorithms */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Featured Algorithms</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.slice(0, 6).map((algo) => (
              <Card
                key={algo.id}
                className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-0 overflow-hidden group"
                onClick={() => {
                  setSelectedAlgorithm(algo.id);
                  setShowHome(false);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {algo.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{algo.category}</CardDescription>
                    </div>
                    <Badge variant="outline">{algo.inputType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{algo.description}</p>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-mono text-sm font-semibold text-primary">
                        {algo.timeComplexity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Space</p>
                      <p className="font-mono text-sm font-semibold text-accent">
                        {algo.spaceComplexity}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowHome(false)}
              className="gap-2"
            >
              View All Algorithms <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Interview Prep CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 w-full sm:w-auto"
            onClick={() => setShowInterviewMode(true)}
          >
            <Briefcase className="w-5 h-5" />
            DSA for Interviews
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border border-primary/20">
          <h2 className="text-3xl font-bold">Ready to Master Algorithms?</h2>
          <p className="text-lg text-muted-foreground">
            Start your learning journey with interactive visualizations
          </p>
          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-primary to-accent"
            onClick={() => setShowHome(false)}
          >
            Explore Now <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PageContent />
    </Suspense>
  );
}
