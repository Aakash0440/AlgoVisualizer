import { AlgorithmEngine } from '../engine';

export class KMPAlgorithm extends AlgorithmEngine {
  search(text: string, pattern: string): void {
    this.resetSteps();

    if (pattern.length === 0) {
      this.addStep('error', {}, 'Pattern cannot be empty');
      return;
    }

    this.addStep('start', { text, pattern }, `Searching for "${pattern}" in "${text}"`);

    // Build LPS (Longest Proper Prefix which is also Suffix) array
    const lps = this.buildLPS(pattern);

    this.addStep(
      'lpsArray',
      { pattern, lps },
      `Built LPS array: [${lps.join(', ')}]`
    );

    let i = 0; // Index for text
    let j = 0; // Index for pattern

    while (i < text.length) {
      if (text[i] === pattern[j]) {
        this.addStep(
          'charMatch',
          { textIndex: i, patternIndex: j, char: text[i] },
          `Character match at text[${i}] = pattern[${j}] = '${text[i]}'`
        );
        i++;
        j++;
      } else {
        this.addStep(
          'mismatch',
          { textIndex: i, patternIndex: j },
          `Mismatch at text[${i}] and pattern[${j}]`
        );

        if (j !== 0) {
          j = lps[j - 1];
          this.addStep(
            'backtrack',
            { newPatternIndex: j },
            `Using LPS, backtrack to pattern index ${j}`
          );
        } else {
          i++;
        }
      }

      if (j === pattern.length) {
        this.addStep(
          'found',
          { index: i - j, text, pattern },
          `Pattern found at index ${i - j}`
        );
        j = lps[j - 1];
      }
    }

    if (j === 0) {
      this.addStep('notFound', { pattern }, `Pattern "${pattern}" not found`);
    }
  }

  private buildLPS(pattern: string): number[] {
    const lps: number[] = Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }
}

export function createKMP(): KMPAlgorithm {
  return new KMPAlgorithm();
}
