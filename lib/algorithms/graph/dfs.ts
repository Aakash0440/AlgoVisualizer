import { AlgorithmEngine } from '../engine';
import type { GraphNode, GraphEdge } from '../../types';

export class DepthFirstSearch extends AlgorithmEngine {
  traverse(nodes: GraphNode[], edges: GraphEdge[], startNode: string): void {
    this.resetSteps();

    const visited = new Set<string>();

    this.addStep('start', { startNode }, `Starting DFS from node ${startNode}`);
    this.dfsHelper(edges, startNode, visited);

    this.addStep('complete', { visitedNodes: Array.from(visited) }, 'DFS traversal complete!');
  }

  private dfsHelper(edges: GraphEdge[], node: string, visited: Set<string>): void {
    visited.add(node);
    this.addStep('visitNode', { node }, `Visiting node ${node}`);

    // Find all adjacent nodes
    const adjacentNodes = edges.filter((e) => e.source === node).map((e) => e.target);

    for (const neighbor of adjacentNodes) {
      this.addStep(
        'exploreEdge',
        { from: node, to: neighbor },
        `Exploring edge from ${node} to ${neighbor}`
      );

      if (!visited.has(neighbor)) {
        this.dfsHelper(edges, neighbor, visited);
      } else {
        this.addStep('alreadyVisited', { node: neighbor }, `Node ${neighbor} already visited`);
      }
    }

    this.addStep('backtrack', { node }, `Backtracking from node ${node}`);
  }
}

export function createDFS(): DepthFirstSearch {
  return new DepthFirstSearch();
}
