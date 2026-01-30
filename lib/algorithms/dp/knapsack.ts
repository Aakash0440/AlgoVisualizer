import { AlgorithmEngine } from '../engine';

export class KnapsackDP extends AlgorithmEngine {
  solve(weights: number[], values: number[], capacity: number): void {
    this.resetSteps();

    const n = weights.length;
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

    this.addStep(
      'initialize',
      { weights, values, capacity, n },
      `Solving 0/1 Knapsack: ${n} items, capacity ${capacity}`
    );

    // Build the DP table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        this.addStep(
          'checkCell',
          { item: i - 1, weight: w },
          `Item ${i - 1}: weight=${weights[i - 1]}, value=${values[i - 1]}`
        );

        if (weights[i - 1] <= w) {
          // Can include this item
          const includeValue = values[i - 1] + dp[i - 1][w - weights[i - 1]];
          const excludeValue = dp[i - 1][w];

          if (includeValue > excludeValue) {
            dp[i][w] = includeValue;
            this.addStep(
              'updateCell',
              {
                item: i - 1,
                weight: w,
                value: includeValue,
                decision: 'include',
              },
              `Including item ${i - 1}: value = ${includeValue}`
            );
          } else {
            dp[i][w] = excludeValue;
            this.addStep(
              'updateCell',
              {
                item: i - 1,
                weight: w,
                value: excludeValue,
                decision: 'exclude',
              },
              `Excluding item ${i - 1}: value = ${excludeValue}`
            );
          }
        } else {
          // Cannot include this item
          dp[i][w] = dp[i - 1][w];
          this.addStep(
            'cannotInclude',
            { item: i - 1, weight: w },
            `Item ${i - 1} too heavy for capacity ${w}`
          );
        }
      }
    }

    this.addStep(
      'complete',
      { maxValue: dp[n][capacity] },
      `Maximum value: ${dp[n][capacity]}`
    );
  }
}

export function createKnapsackDP(): KnapsackDP {
  return new KnapsackDP();
}
