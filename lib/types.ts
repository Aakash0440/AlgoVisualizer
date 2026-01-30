// Algorithm step definitions for animation
export interface AlgorithmStep {
  action: string;
  data?: Record<string, any>;
  description?: string;
}

// Array-based algorithm state
export interface ArrayState {
  values: number[];
  comparing?: number[];
  compared?: number[];
  sorted?: number[];
  visited?: number[];
}

// Graph node and edge definitions
export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  visited?: boolean;
  active?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visitedNodes?: string[];
  visitedEdges?: string[];
  activeNode?: string;
  distances?: Record<string, number>;
}

// Algorithm metadata
export interface AlgorithmConfig {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'graph' | 'dp' | 'string';
  description: string;
  inputType: 'array' | 'graph' | 'string' | 'mixed';
  timeComplexity: string;
  spaceComplexity: string;
}

// Visualization context
export interface VisualizationContext {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  steps: AlgorithmStep[];
  state: any;
  algorithm: AlgorithmConfig;
}
