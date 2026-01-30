import { AlgorithmEngine } from '../engine';
import type { GraphNode, GraphEdge } from '../../types';

export class Dijkstra extends AlgorithmEngine {
  findShortestPath(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNode: string,
    endNode?: string
  ): void {
    this.resetSteps();

    const distances: Record<string, number> = {};
    const visited = new Set<string>();
    const unvisited = new Set<string>();

    // Initialize distances
    for (const node of nodes) {
      distances[node.id] = node.id === startNode ? 0 : Infinity;
      unvisited.add(node.id);
    }

    this.addStep(
      'initialize',
      { startNode, distances: { ...distances } },
      `Starting Dijkstra from node ${startNode}`
    );

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let minNode = '';
      let minDist = Infinity;

      for (const node of unvisited) {
        if (distances[node] < minDist) {
          minDist = distances[node];
          minNode = node;
        }
      }

      if (minDist === Infinity) break;

      visited.add(minNode);
      unvisited.delete(minNode);

      this.addStep('selectNode', { node: minNode, distance: minDist }, `Selected node ${minNode}`);

      // Check all edges from current node
      for (const edge of edges) {
        if (edge.source === minNode && unvisited.has(edge.target)) {
          const weight = edge.weight || 1;
          const newDist = distances[minNode] + weight;

          this.addStep(
            'checkEdge',
            { from: minNode, to: edge.target, weight },
            `Checking edge ${minNode} → ${edge.target} (weight: ${weight})`
          );

          if (newDist < distances[edge.target]) {
            distances[edge.target] = newDist;
            this.addStep(
              'updateDistance',
              {
                node: edge.target,
                oldDistance: distances[edge.target],
                newDistance: newDist,
              },
              `Updated distance to ${edge.target}: ${newDist}`
            );
          }
        }
      }
    }

    this.addStep(
      'complete',
      { distances: { ...distances } },
      'Dijkstra algorithm complete!'
    );
  }
}

export function createDijkstra(): Dijkstra {
  return new Dijkstra();
}
