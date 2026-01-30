import { AlgorithmEngine } from '../engine';
import type { GraphNode, GraphEdge } from '../../types';

export class BreadthFirstSearch extends AlgorithmEngine {
  traverse(nodes: GraphNode[], edges: GraphEdge[], startNode: string): void {
    this.resetSteps();

    const visited = new Set<string>();
    const queue: string[] = [];

    this.addStep('start', { startNode }, `Starting BFS from node ${startNode}`);

    queue.push(startNode);
    visited.add(startNode);
    this.addStep('enqueue', { node: startNode }, `Enqueued node ${startNode}`);

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      this.addStep('visitNode', { node: currentNode }, `Visiting node ${currentNode}`);

      // Find all adjacent nodes
      const adjacentNodes = edges
        .filter((e) => e.source === currentNode)
        .map((e) => e.target);

      for (const neighbor of adjacentNodes) {
        this.addStep(
          'exploreEdge',
          { from: currentNode, to: neighbor },
          `Exploring edge from ${currentNode} to ${neighbor}`
        );

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          this.addStep(
            'enqueue',
            { node: neighbor },
            `Node ${neighbor} not visited, enqueuing...`
          );
        } else {
          this.addStep('alreadyVisited', { node: neighbor }, `Node ${neighbor} already visited`);
        }
      }
    }

    this.addStep('complete', { visitedNodes: Array.from(visited) }, 'BFS traversal complete!');
  }
}

export function createBFS(): BreadthFirstSearch {
  return new BreadthFirstSearch();
}
