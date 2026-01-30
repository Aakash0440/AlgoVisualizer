'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VisualizationControls } from './visualizers/VisualizationControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlgorithmStep, GraphNode, GraphEdge } from '@/lib/types';

interface GraphVisualizerProps {
  algorithmName: string;
  algorithmGenerator: (nodes: GraphNode[], edges: GraphEdge[], startNode: string) => AlgorithmStep[];
}

// Sample graph for demonstration
const SAMPLE_NODES: GraphNode[] = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
  { id: 'E', label: 'E' },
];

const SAMPLE_EDGES: GraphEdge[] = [
  { source: 'A', target: 'B', weight: 4 },
  { source: 'A', target: 'C', weight: 2 },
  { source: 'B', target: 'C', weight: 1 },
  { source: 'B', target: 'D', weight: 5 },
  { source: 'C', target: 'D', weight: 8 },
  { source: 'C', target: 'E', weight: 10 },
  { source: 'D', target: 'E', weight: 2 },
];

export function GraphVisualizer({
  algorithmName,
  algorithmGenerator,
}: GraphVisualizerProps) {
  const [nodes, setNodes] = useState<GraphNode[]>(SAMPLE_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(SAMPLE_EDGES);
  const [startNode, setStartNode] = useState('A');
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [stepDescription, setStepDescription] = useState('');

  // Arrange nodes in a circle
  const arrangedNodes = nodes.map((node, idx) => {
    const angle = (idx / nodes.length) * Math.PI * 2;
    const radius = 120;
    return {
      ...node,
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle),
    };
  });

  // Generate steps
  useEffect(() => {
    const newSteps = algorithmGenerator(arrangedNodes, edges, startNode);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setVisitedNodes([]);
    setActiveNode(null);
    setStepDescription('');
  }, [startNode, algorithmGenerator, arrangedNodes, edges]);

  // Process current step
  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      setStepDescription(step.description || '');

      switch (step.action) {
        case 'visitNode':
          setVisitedNodes((prev) => [...new Set([...prev, step.data?.node])]);
          setActiveNode(step.data?.node);
          break;

        case 'complete':
          setVisitedNodes(step.data?.visitedNodes || []);
          setActiveNode(null);
          setIsPlaying(false);
          break;

        case 'enqueue':
        case 'start':
          setActiveNode(step.data?.startNode || step.data?.node);
          break;

        case 'selectNode':
          setActiveNode(step.data?.node);
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
    setVisitedNodes([]);
    setActiveNode(null);
    setStepDescription('');
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{algorithmName}</CardTitle>
          <CardDescription>
            Step-by-step visualization of the {algorithmName} algorithm on a sample graph
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <label className="text-sm font-medium">Start Node:</label>
            <div className="flex gap-1">
              {arrangedNodes.map((node) => (
                <Button
                  key={node.id}
                  variant={startNode === node.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setStartNode(node.id);
                    handleReset();
                  }}
                >
                  {node.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Graph Visualization */}
          <div className="w-full bg-card border border-border rounded-lg p-4">
            <svg width="100%" height="400" viewBox="0 0 400 400" className="bg-background rounded">
              {/* Draw edges */}
              {edges.map((edge, idx) => {
                const fromNode = arrangedNodes.find((n) => n.id === edge.source);
                const toNode = arrangedNodes.find((n) => n.id === edge.target);

                if (!fromNode || !toNode) return null;

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-border"
                  />
                );
              })}

              {/* Draw nodes */}
              {arrangedNodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill={
                      node.id === activeNode
                        ? '#ef4444'
                        : visitedNodes.includes(node.id)
                          ? 'hsl(var(--color-algo-visited))'
                          : 'hsl(var(--color-algo-primary))'
                    }
                    className="transition-all"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dy="0.3em"
                    fill="white"
                    fontWeight="bold"
                    fontSize="16"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
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
        </CardContent>
      </Card>
    </div>
  );
}
