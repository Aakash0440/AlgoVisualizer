import { AlgorithmEngine } from '../engine';

export class BubbleSort extends AlgorithmEngine {
  sort(arr: number[]): void {
    const values = [...arr];
    const n = values.length;

    this.resetSteps();

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare adjacent elements (line 5-6 in code)
        this.addComparison([j, j + 1], values, `Comparing ${values[j]} and ${values[j + 1]}`, 6);

        // Swap if needed (line 7)
        if (values[j] > values[j + 1]) {
          [values[j], values[j + 1]] = [values[j + 1], values[j]];
          this.addSwap([j, j + 1], [...values], 7);
        }
      }

      // Mark as sorted (line 4 - next iteration)
      this.addSorted(n - i - 1, [...values], 4);
    }

    // Final array is sorted (line 11)
    this.markComplete([...values], 'Bubble sort complete!', 11);
  }
}

export function createBubbleSort(): BubbleSort {
  return new BubbleSort();
}
