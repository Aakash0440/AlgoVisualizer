/** Interview problem definition for DSA Interview Prep mode */
export interface InterviewProblem {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companies: string[];
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  hints: string[];
  optimalSolution: string;
  similarProblems: string[];
}

export const INTERVIEW_PROBLEMS: Record<string, InterviewProblem> = {
  twoSum: {
    id: 'twoSum',
    name: 'Two Sum',
    difficulty: 'Easy',
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 6.',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    hints: [
      'Think about using a hash map to store seen values.',
      'For each element, check if (target - element) exists in the map.',
      'A one-pass solution is possible.',
    ],
    optimalSolution: 'Hash Map - O(n) time, O(n) space. One pass: for each num, if (target - num) is in map, return [map.get(target - num), i]; else map.set(num, i).',
    similarProblems: ['3Sum', '4Sum', 'Two Sum II - Input Array Is Sorted'],
  },
  validParentheses: {
    id: 'validParentheses',
    name: 'Valid Parentheses',
    difficulty: 'Easy',
    companies: ['Amazon', 'Bloomberg', 'Meta', 'Microsoft'],
    description:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'Valid pair.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All pairs valid.' },
      { input: 's = "(]"', output: 'false', explanation: 'Wrong closing bracket.' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}".'],
    hints: [
      'Use a stack to track opening brackets.',
      'When you see a closing bracket, it must match the top of the stack.',
      'Stack should be empty at the end for valid string.',
    ],
    optimalSolution: 'Stack - O(n) time, O(n) space. Push opening brackets; for closing, pop and check match.',
    similarProblems: ['Minimum Add to Make Parentheses Valid', 'Generate Parentheses'],
  },
  mergeTwoSortedLists: {
    id: 'mergeTwoSortedLists',
    name: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    companies: ['Amazon', 'Apple', 'Microsoft', 'Meta'],
    description:
      'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
        explanation: 'Merged in sorted order.',
      },
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    hints: [
      'Use a dummy node to simplify edge cases.',
      'Compare heads of both lists and attach the smaller one.',
      'Don\'t forget to attach the remaining nodes.',
    ],
    optimalSolution: 'Iterative with dummy node - O(n + m) time, O(1) space.',
    similarProblems: ['Merge k Sorted Lists', 'Merge Sorted Array'],
  },
  maxSubarray: {
    id: 'maxSubarray',
    name: 'Maximum Subarray (Kadane\'s)',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Apple', 'Google'],
    description:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.',
      },
      { input: 'nums = [1]', output: '1', explanation: 'Single element.' },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    hints: [
      'Think about what the max sum ending at each index could be.',
      'At each index, either extend the previous subarray or start fresh.',
      'One variable for current sum, one for global max.',
    ],
    optimalSolution: "Kadane's Algorithm - O(n) time, O(1) space. current = max(num, current + num), maxSum = max(maxSum, current).",
    similarProblems: ['Best Time to Buy and Sell Stock', 'Maximum Product Subarray'],
  },
  lruCache: {
    id: 'lruCache',
    name: 'LRU Cache',
    difficulty: 'Medium',
    companies: ['Amazon', 'Meta', 'Microsoft', 'Google', 'Bloomberg'],
    description:
      'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(int capacity), get(int key), put(int key, int value). get and put must run in O(1) average time.',
    examples: [
      {
        input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: '[null,null,null,1,null,-1,null,-1,3,4]',
        explanation: 'Capacity 2. After put(1,1), put(2,2), get(1)=1. put(3,3) evicts 2. get(2)=-1. put(4,4) evicts 1. get(1)=-1, get(3)=3, get(4)=4.',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    hints: [
      'HashMap gives O(1) get/put by key; you need O(1) "least recently used" ordering.',
      'A doubly linked list can track order; move to head on get/put, evict from tail.',
      'Combine HashMap (key -> node) with doubly linked list.',
    ],
    optimalSolution: 'HashMap + Doubly Linked List - O(1) get and put. List for order, map for key -> node.',
    similarProblems: ['LFU Cache', 'Design Linked List'],
  },
};

export function getInterviewProblemsByDifficulty(
  difficulty?: 'Easy' | 'Medium' | 'Hard'
): InterviewProblem[] {
  const list = Object.values(INTERVIEW_PROBLEMS);
  if (difficulty) return list.filter((p) => p.difficulty === difficulty);
  return list;
}

export function getInterviewProblem(id: string): InterviewProblem | null {
  return INTERVIEW_PROBLEMS[id] ?? null;
}
