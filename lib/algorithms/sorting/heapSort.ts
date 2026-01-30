import { AlgorithmEngine } from '../engine';

export class HeapSort extends AlgorithmEngine {
  sort(arr: number[]): void {
    const values = [...arr];
    const n = values.length;

    this.resetSteps();

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(values, n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      [values[0], values[i]] = [values[i], values[0]];
      this.addSwap([0, i], [...values]);

      this.addSorted(i, [...values]);

      // Heapify reduced heap
      this.heapify(values, i, 0);
    }

    this.markComplete([...values], 'Heap sort complete!');
  }

  private heapify(arr: number[], n: number, i: number): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      this.addComparison(
        [i, largest],
        arr,
        `Comparing parent ${arr[i]} with child ${arr[largest]}`
      );

      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      this.addSwap([i, largest], [...arr]);

      this.heapify(arr, n, largest);
    }
  }
}

export function createHeapSort(): HeapSort {
  return new HeapSort();
}
