/** Algorithm source code and metadata for code pane display */
export interface AlgorithmCodeInfo {
  name: string;
  complexity: string;
  code: string;
}

const BUBBLE_SORT_CODE = `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

const MERGE_SORT_CODE = `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return result.concat(left.slice(i), right.slice(j));
}`;

const HEAP_SORT_CODE = `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1, right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`;

const LINEAR_SEARCH_CODE = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`;

const BINARY_SEARCH_CODE = `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`;

export const ALGORITHM_CODE: Record<string, AlgorithmCodeInfo> = {
  'bubble-sort': {
    name: 'Bubble Sort',
    complexity: 'O(n²) time, O(1) space',
    code: BUBBLE_SORT_CODE,
  },
  'merge-sort': {
    name: 'Merge Sort',
    complexity: 'O(n log n) time, O(n) space',
    code: MERGE_SORT_CODE,
  },
  'heap-sort': {
    name: 'Heap Sort',
    complexity: 'O(n log n) time, O(1) space',
    code: HEAP_SORT_CODE,
  },
  'linear-search': {
    name: 'Linear Search',
    complexity: 'O(n) time, O(1) space',
    code: LINEAR_SEARCH_CODE,
  },
  'binary-search': {
    name: 'Binary Search',
    complexity: 'O(log n) time, O(1) space',
    code: BINARY_SEARCH_CODE,
  },
  'bfs': {
    name: 'BFS',
    complexity: 'O(V + E) time, O(V) space',
    code: `function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  while (queue.length) {
    const node = queue.shift();
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited;
}`,
  },
  'dfs': {
    name: 'DFS',
    complexity: 'O(V + E) time, O(V) space',
    code: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);
  }
  return visited;
}`,
  },
  'dijkstra': {
    name: "Dijkstra's Algorithm",
    complexity: 'O((V + E) log V) time, O(V) space',
    code: `function dijkstra(graph, start) {
  const dist = {};
  const pq = new MinHeap([[0, start]]);
  for (const v of Object.keys(graph)) dist[v] = Infinity;
  dist[start] = 0;
  while (pq.size()) {
    const [d, u] = pq.extractMin();
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.insert([dist[v], v]);
      }
    }
  }
  return dist;
}`,
  },
  'fibonacci': {
    name: 'Fibonacci (DP)',
    complexity: 'O(n) time, O(n) space',
    code: `function fib(n) {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
  },
  'knapsack': {
    name: '0/1 Knapsack',
    complexity: 'O(nW) time, O(nW) space',
    code: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array(n + 1).fill(0).map(() => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i-1] <= w)
        dp[i][w] = Math.max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w]);
      else dp[i][w] = dp[i-1][w];
    }
  }
  return dp[n][W];
}`,
  },
  'kmp': {
    name: 'KMP String Matching',
    complexity: 'O(n + m) time, O(m) space',
    code: `function kmpSearch(text, pattern) {
  const lps = computeLPS(pattern);
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) { i++; j++; }
    if (j === pattern.length) return i - j;
    if (i < text.length && text[i] !== pattern[j]) {
      j ? j = lps[j - 1] : i++;
    }
  }
  return -1;
}`,
  },
};

export function getAlgorithmCode(algorithmId: string): AlgorithmCodeInfo | null {
  return ALGORITHM_CODE[algorithmId] ?? null;
}
