import { AlgorithmEngine } from '../engine';

export class FibonacciDP extends AlgorithmEngine {
  compute(n: number): void {
    this.resetSteps();

    if (n < 0) {
      this.addStep('error', {}, 'n must be non-negative');
      return;
    }

    const dp: number[] = [];

    this.addStep('initialize', { n }, `Computing Fibonacci(${n}) using dynamic programming`);

    // Base cases
    dp[0] = 0;
    dp[1] = 1;

    this.addStep(
      'baseCase',
      { index: 0, value: 0 },
      'Base case: F(0) = 0'
    );
    this.addStep(
      'baseCase',
      { index: 1, value: 1 },
      'Base case: F(1) = 1'
    );

    // Build up the table
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];

      this.addStep(
        'compute',
        { index: i, value: dp[i], formula: `F(${i}) = F(${i - 1}) + F(${i - 2})` },
        `F(${i}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
      );
    }

    this.addStep('complete', { dp: dp.slice(0, n + 1), result: dp[n] }, `F(${n}) = ${dp[n]}`);
  }
}

export function createFibonacciDP(): FibonacciDP {
  return new FibonacciDP();
}
