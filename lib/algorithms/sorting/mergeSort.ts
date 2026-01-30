import { AlgorithmEngine } from '../engine';

export class MergeSort extends AlgorithmEngine {
  sort(arr: number[]): void {
    const values = [...arr];
    this.resetSteps();
    this.mergeSortHelper(values, 0, values.length - 1);
    this.markComplete([...values], 'Merge sort complete!');
  }

  private mergeSortHelper(arr: number[], left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      // Divide
      this.addStep(
        'divide',
        { left, mid, right },
        `Dividing array from index ${left} to ${right}`
      );

      this.mergeSortHelper(arr, left, mid);
      this.mergeSortHelper(arr, mid + 1, right);

      // Merge
      this.merge(arr, left, mid, right);
    }
  }

  private merge(arr: number[], left: number, mid: number, right: number): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0,
      j = 0,
      k = left;

    this.addStep(
      'mergeStart',
      { left, mid, right },
      `Starting merge from index ${left} to ${right}`
    );

    while (i < leftArr.length && j < rightArr.length) {
      this.addComparison(
        [left + i, mid + 1 + j],
        arr,
        `Comparing ${leftArr[i]} and ${rightArr[j]}`
      );

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      this.addStep('place', { index: k, value: arr[k] }, `Placed ${arr[k]}`);
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      this.addStep('place', { index: k, value: arr[k] }, `Placed ${arr[k]}`);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      this.addStep('place', { index: k, value: arr[k] }, `Placed ${arr[k]}`);
      j++;
      k++;
    }
  }
}

export function createMergeSort(): MergeSort {
  return new MergeSort();
}
