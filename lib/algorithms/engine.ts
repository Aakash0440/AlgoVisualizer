import { AlgorithmStep, ArrayState } from '../types';

// Base algorithm engine for generating animation steps
export class AlgorithmEngine {
  protected steps: AlgorithmStep[] = [];

  getSteps(): AlgorithmStep[] {
    return this.steps;
  }

  resetSteps(): void {
    this.steps = [];
  }

  // Helper to add step
  protected addStep(
    action: string,
    data?: Record<string, any>,
    description?: string,
    codeLine?: number,
    swapped?: boolean
  ): void {
    this.steps.push({ action, data, description, codeLine, swapped });
  }

  // Helper to add comparison step
  protected addComparison(
    indices: number[],
    values: number[],
    description?: string,
    codeLine?: number
  ): void {
    this.addStep('compare', { indices, values }, description, codeLine);
  }

  // Helper to add swap step
  protected addSwap(indices: number[], values: number[], codeLine?: number): void {
    this.addStep('swap', { indices, values }, undefined, codeLine, true);
  }

  // Helper to add visited step
  protected addVisited(index: number, values: number[], codeLine?: number): void {
    this.addStep('visited', { index, values }, undefined, codeLine);
  }

  // Helper to add sorted step
  protected addSorted(index: number, values: number[], codeLine?: number): void {
    this.addStep('sorted', { index, values }, undefined, codeLine);
  }

  // Helper to mark entire array as sorted
  protected markComplete(values: number[], message?: string, codeLine?: number): void {
    this.addStep('complete', { values }, message || 'Array sorted!', codeLine);
  }
}

// Helper function to shuffle array
export function shuffleArray(arr: number[]): number[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Helper function to create array of random numbers
export function generateRandomArray(
  size: number,
  min: number = 1,
  max: number = 100
): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

// Helper to clone array state
export function cloneArrayState(state: ArrayState): ArrayState {
  return {
    values: [...state.values],
    comparing: state.comparing ? [...state.comparing] : undefined,
    compared: state.compared ? [...state.compared] : undefined,
    sorted: state.sorted ? [...state.sorted] : undefined,
    visited: state.visited ? [...state.visited] : undefined,
  };
}
