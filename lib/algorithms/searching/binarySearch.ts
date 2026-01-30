import { AlgorithmEngine } from '../engine';

export class BinarySearch extends AlgorithmEngine {
  search(arr: number[], target: number): void {
    const values = [...arr].sort((a, b) => a - b);
    this.resetSteps();

    this.addStep('start', { target }, `Searching for ${target} (array must be sorted)`);

    let left = 0;
    let right = values.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      this.addComparison(
        [left, mid, right],
        values,
        `Searching between index ${left} and ${right}, checking mid index ${mid} (${values[mid]})`
      );

      if (values[mid] === target) {
        this.addStep('found', { index: mid, value: target }, `Found ${target} at index ${mid}!`);
        return;
      }

      if (values[mid] < target) {
        this.addStep(
          'searchRight',
          { left: mid + 1, right },
          `${target} > ${values[mid]}, searching right half`
        );
        left = mid + 1;
      } else {
        this.addStep(
          'searchLeft',
          { left, right: mid - 1 },
          `${target} < ${values[mid]}, searching left half`
        );
        right = mid - 1;
      }
    }

    this.addStep('notFound', { target }, `${target} not found in array`);
  }
}

export function createBinarySearch(): BinarySearch {
  return new BinarySearch();
}
