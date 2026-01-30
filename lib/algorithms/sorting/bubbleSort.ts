import { AlgorithmEngine } from '../engine';

export class BubbleSort extends AlgorithmEngine {
  sort(arr: number[]): void {
    const values = [...arr];
    const n = values.length;

    this.resetSteps();

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare adjacent elements
        this.addComparison([j, j + 1], values, `Comparing ${values[j]} and ${values[j + 1]}`);

        // Swap if needed
        if (values[j] > values[j + 1]) {
          [values[j], values[j + 1]] = [values[j + 1], values[j]];
          this.addSwap([j, j + 1], [...values]);
        }
      }

      // Mark as sorted
      this.addSorted(n - i - 1, [...values]);
    }

    // Final array is sorted
    this.markComplete([...values], 'Bubble sort complete!');
  }
}

export function createBubbleSort(): BubbleSort {
  return new BubbleSort();
}
