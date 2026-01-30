import { AlgorithmEngine } from '../engine';

export class LinearSearch extends AlgorithmEngine {
  search(arr: number[], target: number): void {
    const values = [...arr];
    this.resetSteps();

    this.addStep('start', { target }, `Searching for ${target}`);

    for (let i = 0; i < values.length; i++) {
      this.addComparison([i], values, `Checking index ${i}: ${values[i]}`);

      if (values[i] === target) {
        this.addStep('found', { index: i, value: target }, `Found ${target} at index ${i}!`);
        return;
      }

      this.addVisited(i, values);
    }

    this.addStep('notFound', { target }, `${target} not found in array`);
  }
}

export function createLinearSearch(): LinearSearch {
  return new LinearSearch();
}
