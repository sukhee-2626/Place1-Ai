'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Check, ExternalLink, Search, ChevronDown, ChevronRight,
  Binary, Code, Play, Send, X, Terminal, Settings,
  CheckCircle2, Circle, Lock, Unlock, Star,
  Hash, Link as LinkIcon, AlignJustify, List, Zap, Brain,
  BarChart2, Type, GitFork, Network, Layers, Grid,
  TrendingUp, Eye, BookOpen, Trophy, Filter,
  ChevronLeft, Target, Flame, Award, ArrowUpRight
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// ─── DSA Topic Data (from Curious Freaks Coding Sheet) ───────────────────────
const DSA_TRACKS = [
  {
    id: 'basics', name: 'Basics', icon: '📐', color: '#6366f1', order: 1,
    description: 'Fundamental math & logic problems',
    subtopics: [
      {
        name: 'Basic Math Problems',
        problems: [
          { title: 'Find even or odd', link: 'https://practice.geeksforgeeks.org/problems/odd-or-even3618/1', difficulty: 'Easy' },
          { title: 'Find last digit in a number', link: 'https://www.geeksforgeeks.org/problems/find-last-digit-of-ab-for-large-numbers1936/1', difficulty: 'Easy' },
          { title: 'Count digits in a number', link: 'https://practice.geeksforgeeks.org/problems/count-digits5716/1', difficulty: 'Easy' },
          { title: 'Reverse a number', link: 'https://www.geeksforgeeks.org/problems/reverse-digit0316/1', difficulty: 'Easy' },
          { title: 'Find power of a number', link: 'https://www.geeksforgeeks.org/problems/power-of-numbers-1587115620/1', difficulty: 'Easy' },
          { title: 'GCD', link: 'https://practice.geeksforgeeks.org/problems/gcd-of-two-numbers3459/1', difficulty: 'Easy' },
          { title: 'Print all divisors of a number', link: 'https://www.codingninjas.com/studio/problems/print-all-divisors-of-a-number_1164188', difficulty: 'Easy' },
          { title: 'Prime number', link: 'https://practice.geeksforgeeks.org/problems/prime-number2314/1', difficulty: 'Easy' },
          { title: 'Armstrong number', link: 'https://www.geeksforgeeks.org/problems/armstrong-numbers2727/1', difficulty: 'Easy' },
          { title: 'Check palindrome of number', link: 'https://practice.geeksforgeeks.org/problems/palindrome0746/1', difficulty: 'Easy' },
          { title: 'Square root of a number', link: 'https://www.geeksforgeeks.org/problems/square-root/1', difficulty: 'Easy' },
          { title: 'Perfect number', link: 'https://practice.geeksforgeeks.org/problems/perfect-numbers3207/1', difficulty: 'Easy' },
        ]
      }
    ]
  },
  {
    id: 'arrays', name: 'Arrays', icon: '🧮', color: '#8b5cf6', order: 2,
    description: 'Array traversal, sorting, two-pointer & sliding window',
    subtopics: [
      {
        name: 'Traversal & Basics',
        problems: [
          { title: 'Find maximum and minimum element in array', link: 'https://www.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4428/1', difficulty: 'Easy' },
          { title: 'Find third largest element in array', link: 'https://practice.geeksforgeeks.org/problems/third-largest-element/1', difficulty: 'Easy' },
          { title: 'Search an element in array', link: 'https://www.geeksforgeeks.org/problems/search-an-element-in-an-array-1587115621/1', difficulty: 'Easy' },
          { title: 'Find missing number in array', link: 'https://practice.geeksforgeeks.org/problems/missing-number-in-array1416/1', difficulty: 'Easy' },
          { title: 'Sort an array of 0s, 1s and 2s', link: 'https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1', difficulty: 'Medium' },
          { title: 'Check if two arrays are equal or not', link: 'https://www.geeksforgeeks.org/problems/check-if-two-arrays-are-equal-or-not3847/1', difficulty: 'Easy' },
          { title: 'Rotate the array by 1', link: 'https://www.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one2614/1', difficulty: 'Easy' },
          { title: 'Rotate the array by k', link: 'https://www.codingninjas.com/studio/problems/rotate-array_1230543', difficulty: 'Medium' },
          { title: 'Array subset of another array', link: 'https://www.geeksforgeeks.org/problems/array-subset-of-another-array2317/1', difficulty: 'Easy' },
          { title: 'Count frequency of elements in array', link: 'https://practice.geeksforgeeks.org/problems/frequency-of-array-elements-1587115620/1', difficulty: 'Easy' },
          { title: 'Find pair with given sum', link: 'https://www.geeksforgeeks.org/problems/key-pair5616/1', difficulty: 'Easy' },
          { title: '3 Sum', link: 'https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1', difficulty: 'Medium' },
          { title: '4 Sum', link: 'https://leetcode.com/problems/4sum/', difficulty: 'Hard' },
        ]
      },
      {
        name: 'Must Solve',
        problems: [
          { title: 'Subarray with given sum', link: 'https://www.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1', difficulty: 'Medium' },
          { title: 'Maximum sum of subarray', link: 'https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1', difficulty: 'Medium' },
          { title: 'Trapping rain water', link: 'https://leetcode.com/problems/trapping-rain-water/', difficulty: 'Hard' },
          { title: 'Next permutation', link: 'https://leetcode.com/problems/next-permutation/', difficulty: 'Medium' },
          { title: 'Pascal triangle', link: 'https://leetcode.com/problems/pascals-triangle/', difficulty: 'Easy' },
          { title: 'Merge intervals', link: 'https://leetcode.com/problems/merge-intervals/', difficulty: 'Medium' },
          { title: 'Count inversions in array', link: 'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1', difficulty: 'Hard' },
        ]
      },
      {
        name: 'Binary Search',
        problems: [
          { title: 'Binary search', link: 'https://www.geeksforgeeks.org/problems/binary-search-1587115620/1', difficulty: 'Easy' },
          { title: 'First and last occurrence', link: 'https://www.geeksforgeeks.org/problems/first-and-last-occurrences-of-x3116/1', difficulty: 'Easy' },
          { title: 'Sorted rotated array search', link: 'https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1', difficulty: 'Medium' },
          { title: 'Median of two sorted arrays', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', difficulty: 'Hard' },
        ]
      },
      {
        name: 'Sliding Window',
        problems: [
          { title: 'Maximum sum of subarray of size k', link: 'https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1', difficulty: 'Medium' },
          { title: 'Count distinct elements in window', link: 'https://www.geeksforgeeks.org/problems/count-distinct-elements-in-every-window/1', difficulty: 'Medium' },
          { title: 'Longest sub array with sum k', link: 'https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1', difficulty: 'Medium' },
          { title: 'Longest substring without repeating characters', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'Medium' },
          { title: 'Minimum window substring', link: 'https://leetcode.com/problems/minimum-window-substring/', difficulty: 'Hard' },
          { title: 'Longest substring with at most k distinct characters', link: 'https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/', difficulty: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'linkedlist', name: 'Linked List', icon: '🔗', color: '#06b6d4', order: 3,
    description: 'Singly, doubly linked list operations & algorithms',
    subtopics: [
      {
        name: 'Data Structure & Basics',
        problems: [
          { title: 'Implement linked list', link: 'https://www.geeksforgeeks.org/problems/linked-list-insertion-1587115620/1', difficulty: 'Easy' },
          { title: 'Reverse a linked list', link: 'https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1', difficulty: 'Easy' },
          { title: 'Middle of linked list', link: 'https://leetcode.com/problems/middle-of-the-linked-list/', difficulty: 'Easy' },
          { title: 'Delete node in linked list', link: 'https://leetcode.com/problems/delete-node-in-a-linked-list/', difficulty: 'Easy' },
          { title: 'Remove nth node from end', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', difficulty: 'Medium' },
          { title: 'Merge two sorted lists', link: 'https://leetcode.com/problems/merge-two-sorted-lists/', difficulty: 'Easy' },
        ]
      },
      {
        name: 'Loop Detection',
        problems: [
          { title: 'Detect loop in linked list', link: 'https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1', difficulty: 'Easy' },
          { title: 'Find starting point of loop', link: 'https://www.geeksforgeeks.org/problems/find-the-first-node-of-loop-in-linked-list--170645/1', difficulty: 'Medium' },
          { title: 'Remove loop in linked list', link: 'https://www.geeksforgeeks.org/problems/remove-loop-in-linked-list/1', difficulty: 'Medium' },
        ]
      },
      {
        name: 'Sorting & Merging',
        problems: [
          { title: 'Sort linked list', link: 'https://leetcode.com/problems/sort-list/', difficulty: 'Medium' },
          { title: 'Merge k sorted lists', link: 'https://leetcode.com/problems/merge-k-sorted-lists/', difficulty: 'Hard' },
          { title: 'Flatten a linked list', link: 'https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1', difficulty: 'Hard' },
          { title: 'Copy list with random pointer', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/', difficulty: 'Medium' },
        ]
      },
      {
        name: 'Must Solve',
        problems: [
          { title: 'Intersection of two linked lists', link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', difficulty: 'Easy' },
          { title: 'Palindrome linked list', link: 'https://leetcode.com/problems/palindrome-linked-list/', difficulty: 'Easy' },
          { title: 'Add two numbers as linked list', link: 'https://leetcode.com/problems/add-two-numbers/', difficulty: 'Medium' },
          { title: 'Rotate linked list', link: 'https://leetcode.com/problems/rotate-list/', difficulty: 'Medium' },
          { title: 'Reverse nodes in k-group', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', difficulty: 'Hard' },
        ]
      }
    ]
  },
  {
    id: 'stack-queue', name: 'Stack & Queue', icon: '📦', color: '#10b981', order: 4,
    description: 'Stack, queue patterns and classic problems',
    subtopics: [
      {
        name: 'Stack Basics',
        problems: [
          { title: 'Implement stack using arrays', link: 'https://www.geeksforgeeks.org/problems/implement-stack-using-array/1', difficulty: 'Easy' },
          { title: 'Valid parentheses', link: 'https://leetcode.com/problems/valid-parentheses/', difficulty: 'Easy' },
          { title: 'Next greater element I', link: 'https://leetcode.com/problems/next-greater-element-i/', difficulty: 'Easy' },
          { title: 'Next greater element II', link: 'https://leetcode.com/problems/next-greater-element-ii/', difficulty: 'Medium' },
          { title: 'Largest rectangle in histogram', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', difficulty: 'Hard' },
          { title: 'Min stack', link: 'https://leetcode.com/problems/min-stack/', difficulty: 'Easy' },
        ]
      },
      {
        name: 'Stack Applications',
        problems: [
          { title: 'Evaluate reverse polish notation', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', difficulty: 'Medium' },
          { title: 'Decode string', link: 'https://leetcode.com/problems/decode-string/', difficulty: 'Medium' },
          { title: 'Reverse a stack', link: 'https://www.geeksforgeeks.org/problems/reverse-a-stack/1', difficulty: 'Easy' },
          { title: 'Sort a stack', link: 'https://www.geeksforgeeks.org/problems/sort-a-stack/1', difficulty: 'Easy' },
        ]
      },
      {
        name: 'Queue Basics',
        problems: [
          { title: 'Implement queue using arrays', link: 'https://www.geeksforgeeks.org/problems/implement-queue-using-array/1', difficulty: 'Easy' },
          { title: 'Implement queue using stacks', link: 'https://leetcode.com/problems/implement-queue-using-stacks/', difficulty: 'Easy' },
          { title: 'First non repeating character in stream', link: 'https://www.geeksforgeeks.org/problems/first-non-repeating-character-in-a-stream1216/1', difficulty: 'Medium' },
          { title: 'Sliding window maximum', link: 'https://leetcode.com/problems/sliding-window-maximum/', difficulty: 'Hard' },
        ]
      }
    ]
  },
  {
    id: 'trees', name: 'Trees', icon: '🌳', color: '#ef4444', order: 5,
    description: 'Binary trees, BST, traversals & advanced patterns',
    subtopics: [
      {
        name: 'Traversals',
        problems: [
          { title: 'Inorder traversal', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', difficulty: 'Easy' },
          { title: 'Preorder traversal', link: 'https://leetcode.com/problems/binary-tree-preorder-traversal/', difficulty: 'Easy' },
          { title: 'Postorder traversal', link: 'https://leetcode.com/problems/binary-tree-postorder-traversal/', difficulty: 'Easy' },
          { title: 'Level order traversal', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', difficulty: 'Medium' },
          { title: 'Zigzag level order traversal', link: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', difficulty: 'Medium' },
          { title: 'Vertical order traversal', link: 'https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/', difficulty: 'Hard' },
          { title: 'Morris traversal', link: 'https://www.geeksforgeeks.org/inorder-tree-traversal-without-recursion-and-without-stack/', difficulty: 'Hard' },
        ]
      },
      {
        name: 'Path & Distance',
        problems: [
          { title: 'Height of binary tree', link: 'https://www.geeksforgeeks.org/problems/height-of-binary-tree/1', difficulty: 'Easy' },
          { title: 'Diameter of binary tree', link: 'https://leetcode.com/problems/diameter-of-binary-tree/', difficulty: 'Easy' },
          { title: 'Maximum path sum', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', difficulty: 'Hard' },
          { title: 'Root to leaf paths', link: 'https://www.geeksforgeeks.org/problems/root-to-leaf-paths/1', difficulty: 'Medium' },
          { title: 'Path sum', link: 'https://leetcode.com/problems/path-sum/', difficulty: 'Easy' },
          { title: 'Lowest common ancestor', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', difficulty: 'Medium' },
          { title: 'Balanced binary tree', link: 'https://leetcode.com/problems/balanced-binary-tree/', difficulty: 'Easy' },
        ]
      },
      {
        name: 'BST',
        problems: [
          { title: 'Search in BST', link: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', difficulty: 'Easy' },
          { title: 'Insert in BST', link: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/', difficulty: 'Medium' },
          { title: 'Delete node in BST', link: 'https://leetcode.com/problems/delete-node-in-a-bst/', difficulty: 'Medium' },
          { title: 'Validate BST', link: 'https://leetcode.com/problems/validate-binary-search-tree/', difficulty: 'Medium' },
          { title: 'Kth smallest element in BST', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', difficulty: 'Medium' },
          { title: 'Convert sorted array to BST', link: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', difficulty: 'Easy' },
        ]
      },
      {
        name: 'Must Solve Advanced',
        problems: [
          { title: 'Flatten binary tree to linked list', link: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', difficulty: 'Medium' },
          { title: 'Serialize and deserialize binary tree', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', difficulty: 'Hard' },
          { title: 'Symmetric tree', link: 'https://leetcode.com/problems/symmetric-tree/', difficulty: 'Easy' },
          { title: 'Count good nodes in binary tree', link: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/', difficulty: 'Medium' },
          { title: 'Construct tree from preorder and inorder', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', difficulty: 'Medium' },
          { title: 'Right side view', link: 'https://leetcode.com/problems/binary-tree-right-side-view/', difficulty: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'graphs', name: 'Graphs', icon: '🕸️', color: '#dc2626', order: 6,
    description: 'BFS, DFS, topological sort, MST & advanced algorithms',
    subtopics: [
      {
        name: 'BFS & DFS',
        problems: [
          { title: 'BFS of graph', link: 'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1', difficulty: 'Easy' },
          { title: 'DFS of graph', link: 'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1', difficulty: 'Easy' },
          { title: 'Number of islands', link: 'https://leetcode.com/problems/number-of-islands/', difficulty: 'Medium' },
          { title: 'Flood fill', link: 'https://leetcode.com/problems/flood-fill/', difficulty: 'Easy' },
          { title: 'Rotten oranges', link: 'https://leetcode.com/problems/rotting-oranges/', difficulty: 'Medium' },
          { title: 'Word ladder', link: 'https://leetcode.com/problems/word-ladder/', difficulty: 'Hard' },
        ]
      },
      {
        name: 'Topological Sort',
        problems: [
          { title: 'Topological sort DFS', link: 'https://www.geeksforgeeks.org/problems/topological-sort/1', difficulty: 'Medium' },
          { title: 'Topological sort BFS (Kahn algo)', link: 'https://www.geeksforgeeks.org/problems/topological-sort/1', difficulty: 'Medium' },
          { title: 'Detect cycle in directed graph', link: 'https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1', difficulty: 'Medium' },
          { title: 'Course schedule I', link: 'https://leetcode.com/problems/course-schedule/', difficulty: 'Medium' },
          { title: 'Course schedule II', link: 'https://leetcode.com/problems/course-schedule-ii/', difficulty: 'Medium' },
          { title: 'Alien dictionary', link: 'https://www.geeksforgeeks.org/problems/alien-dictionary/1', difficulty: 'Hard' },
        ]
      },
      {
        name: 'Shortest Path',
        problems: [
          { title: 'Dijkstra algorithm', link: 'https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1', difficulty: 'Medium' },
          { title: 'Bellman Ford algorithm', link: 'https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1', difficulty: 'Medium' },
          { title: 'Floyd Warshall algorithm', link: 'https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1', difficulty: 'Medium' },
          { title: 'Shortest path in weighted undirected graph', link: 'https://www.geeksforgeeks.org/problems/shortest-path-in-weighted-undirected-graph/1', difficulty: 'Medium' },
        ]
      },
      {
        name: 'Minimum Spanning Tree',
        problems: [
          { title: 'Kruskal minimum spanning tree', link: 'https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1', difficulty: 'Hard' },
          { title: 'Prim minimum spanning tree', link: 'https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1', difficulty: 'Hard' },
          { title: 'Disjoint set (Union Find)', link: 'https://www.geeksforgeeks.org/problems/disjoint-set-union-find/1', difficulty: 'Medium' },
          { title: 'Number of provinces', link: 'https://leetcode.com/problems/number-of-provinces/', difficulty: 'Medium' },
          { title: 'Making large island', link: 'https://leetcode.com/problems/making-a-large-island/', difficulty: 'Hard' },
        ]
      }
    ]
  },
  {
    id: 'greedy', name: 'Greedy', icon: '⚡', color: '#f97316', order: 7,
    description: 'Greedy strategy, interval scheduling & classic problems',
    subtopics: [
      {
        name: 'Classic Greedy',
        problems: [
          { title: 'Activity selection problem', link: 'https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1', difficulty: 'Medium' },
          { title: 'Fractional knapsack', link: 'https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1', difficulty: 'Medium' },
          { title: 'Job sequencing problem', link: 'https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1', difficulty: 'Medium' },
          { title: 'Minimum number of platforms', link: 'https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1', difficulty: 'Medium' },
          { title: 'Minimum coins', link: 'https://www.geeksforgeeks.org/problems/coin-change2448/1', difficulty: 'Medium' },
          { title: 'Huffman encoding', link: 'https://www.geeksforgeeks.org/problems/huffman-encoding3345/1', difficulty: 'Hard' },
        ]
      },
      {
        name: 'Must Solve',
        problems: [
          { title: 'Jump game', link: 'https://leetcode.com/problems/jump-game/', difficulty: 'Medium' },
          { title: 'Jump game II', link: 'https://leetcode.com/problems/jump-game-ii/', difficulty: 'Medium' },
          { title: 'Gas station', link: 'https://leetcode.com/problems/gas-station/', difficulty: 'Medium' },
          { title: 'Hand of straights', link: 'https://leetcode.com/problems/hand-of-straights/', difficulty: 'Medium' },
          { title: 'Merge triplets to form target', link: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/', difficulty: 'Medium' },
          { title: 'Candy', link: 'https://leetcode.com/problems/candy/', difficulty: 'Hard' },
        ]
      }
    ]
  },
  {
    id: 'dp', name: 'Dynamic Programming', icon: '🧠', color: '#ec4899', order: 8,
    description: 'Memoization, tabulation, 1D/2D DP patterns',
    subtopics: [
      {
        name: '1D Linear DP',
        problems: [
          { title: 'Climbing stairs', link: 'https://leetcode.com/problems/climbing-stairs/', difficulty: 'Easy' },
          { title: 'House robber', link: 'https://leetcode.com/problems/house-robber/', difficulty: 'Medium' },
          { title: 'House robber II', link: 'https://leetcode.com/problems/house-robber-ii/', difficulty: 'Medium' },
          { title: 'Decode ways', link: 'https://leetcode.com/problems/decode-ways/', difficulty: 'Medium' },
          { title: 'Coin change', link: 'https://leetcode.com/problems/coin-change/', difficulty: 'Medium' },
          { title: 'Word break', link: 'https://leetcode.com/problems/word-break/', difficulty: 'Medium' },
        ]
      },
      {
        name: '2D Grid DP',
        problems: [
          { title: 'Unique paths', link: 'https://leetcode.com/problems/unique-paths/', difficulty: 'Medium' },
          { title: 'Unique paths II', link: 'https://leetcode.com/problems/unique-paths-ii/', difficulty: 'Medium' },
          { title: 'Minimum path sum in grid', link: 'https://leetcode.com/problems/minimum-path-sum/', difficulty: 'Medium' },
          { title: 'Triangle minimum path', link: 'https://leetcode.com/problems/triangle/', difficulty: 'Medium' },
          { title: 'Maximal square', link: 'https://leetcode.com/problems/maximal-square/', difficulty: 'Medium' },
          { title: 'Cherry pickup', link: 'https://leetcode.com/problems/cherry-pickup-ii/', difficulty: 'Hard' },
        ]
      },
      {
        name: 'DP on Subsequences',
        problems: [
          { title: 'Longest increasing subsequence', link: 'https://leetcode.com/problems/longest-increasing-subsequence/', difficulty: 'Medium' },
          { title: 'Longest common subsequence', link: 'https://leetcode.com/problems/longest-common-subsequence/', difficulty: 'Medium' },
          { title: '0-1 Knapsack problem', link: 'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1', difficulty: 'Medium' },
          { title: 'Subset sum problem', link: 'https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1', difficulty: 'Medium' },
          { title: 'Partition equal subset sum', link: 'https://leetcode.com/problems/partition-equal-subset-sum/', difficulty: 'Medium' },
          { title: 'Target sum', link: 'https://leetcode.com/problems/target-sum/', difficulty: 'Medium' },
          { title: 'Edit distance', link: 'https://leetcode.com/problems/edit-distance/', difficulty: 'Hard' },
          { title: 'Burst balloons', link: 'https://leetcode.com/problems/burst-balloons/', difficulty: 'Hard' },
        ]
      },
      {
        name: 'DP on Stocks',
        problems: [
          { title: 'Best time to buy and sell stock', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'Easy' },
          { title: 'Best time to buy and sell stock II', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', difficulty: 'Medium' },
          { title: 'Best time to buy and sell stock III', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/', difficulty: 'Hard' },
          { title: 'Best time to buy and sell stock IV', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/', difficulty: 'Hard' },
          { title: 'Best time to buy and sell stock with cooldown', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', difficulty: 'Medium' },
        ]
      },
      {
        name: 'DP on Strings',
        problems: [
          { title: 'Longest common substring', link: 'https://www.geeksforgeeks.org/problems/longest-common-substring1452/1', difficulty: 'Medium' },
          { title: 'Shortest common supersequence', link: 'https://leetcode.com/problems/shortest-common-supersequence/', difficulty: 'Hard' },
          { title: 'Distinct subsequences', link: 'https://leetcode.com/problems/distinct-subsequences/', difficulty: 'Hard' },
          { title: 'Wildcard matching', link: 'https://leetcode.com/problems/wildcard-matching/', difficulty: 'Hard' },
          { title: 'Regular expression matching', link: 'https://leetcode.com/problems/regular-expression-matching/', difficulty: 'Hard' },
        ]
      }
    ]
  },
  {
    id: 'heaps', name: 'Heaps', icon: '📊', color: '#8b5cf6', order: 9,
    description: 'Min/Max heap, top-K, median & merge patterns',
    subtopics: [
      {
        name: 'Basic Heap Patterns',
        problems: [
          { title: 'Implement min heap', link: 'https://www.geeksforgeeks.org/problems/operations-on-binary-min-heap/1', difficulty: 'Easy' },
          { title: 'Kth largest element in an array', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', difficulty: 'Medium' },
          { title: 'Kth smallest element', link: 'https://www.geeksforgeeks.org/problems/kth-smallest-element5635/1', difficulty: 'Medium' },
          { title: 'Top k frequent elements', link: 'https://leetcode.com/problems/top-k-frequent-elements/', difficulty: 'Medium' },
          { title: 'K closest points to origin', link: 'https://leetcode.com/problems/k-closest-points-to-origin/', difficulty: 'Medium' },
        ]
      },
      {
        name: 'Advanced Heap',
        problems: [
          { title: 'Merge k sorted lists', link: 'https://leetcode.com/problems/merge-k-sorted-lists/', difficulty: 'Hard' },
          { title: 'Find median from data stream', link: 'https://leetcode.com/problems/find-median-from-data-stream/', difficulty: 'Hard' },
          { title: 'Task scheduler', link: 'https://leetcode.com/problems/task-scheduler/', difficulty: 'Medium' },
          { title: 'Design twitter', link: 'https://leetcode.com/problems/design-twitter/', difficulty: 'Medium' },
          { title: 'Reorganize string', link: 'https://leetcode.com/problems/reorganize-string/', difficulty: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'trie', name: 'Trie & Strings', icon: '🔤', color: '#14b8a6', order: 10,
    description: 'Trie data structure & advanced string algorithms',
    subtopics: [
      {
        name: 'Trie Basics',
        problems: [
          { title: 'Implement trie', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/', difficulty: 'Medium' },
          { title: 'Search in trie', link: 'https://www.geeksforgeeks.org/problems/trie-search-and-insert/1', difficulty: 'Medium' },
          { title: 'Word search II', link: 'https://leetcode.com/problems/word-search-ii/', difficulty: 'Hard' },
          { title: 'Design add and search words data structure', link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', difficulty: 'Medium' },
          { title: 'Replace words', link: 'https://leetcode.com/problems/replace-words/', difficulty: 'Medium' },
        ]
      },
      {
        name: 'String Algorithms',
        problems: [
          { title: 'KMP algorithm', link: 'https://www.geeksforgeeks.org/problems/search-pattern0205/1', difficulty: 'Hard' },
          { title: 'Z algorithm', link: 'https://www.geeksforgeeks.org/z-algorithm-linear-time-pattern-searching-algorithm/', difficulty: 'Hard' },
          { title: 'Rabin Karp algorithm', link: 'https://www.geeksforgeeks.org/problems/implement-rabinkarp/1', difficulty: 'Hard' },
          { title: 'Longest palindromic substring', link: 'https://leetcode.com/problems/longest-palindromic-substring/', difficulty: 'Medium' },
          { title: 'Palindromic substrings', link: 'https://leetcode.com/problems/palindromic-substrings/', difficulty: 'Medium' },
          { title: 'Group anagrams', link: 'https://leetcode.com/problems/group-anagrams/', difficulty: 'Medium' },
          { title: 'Minimum window substring', link: 'https://leetcode.com/problems/minimum-window-substring/', difficulty: 'Hard' },
        ]
      }
    ]
  }
];

// ─── Difficulty badge colors ──────────────────────────────────────────────────
const DIFF_COLORS: Record<string, { bg: string; text: string }> = {
  Easy:   { bg: 'rgba(16,185,129,0.12)', text: '#34d399' },
  Medium: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24' },
  Hard:   { bg: 'rgba(239,68,68,0.12)',  text: '#f87171' },
};

// ─── Starter code templates ───────────────────────────────────────────────────
const STARTER: Record<string, string> = {
  python: `def solution(nums, target):
    # Write your solution here
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  javascript: `function solution(nums, target) {
  // Write your solution here
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
};`,
  java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
};

export default function DSAPage() {
  const { user, updateUser } = useAuth();

  // ── Completion state (loaded from DB) ──
  const [dbProblems, setDbProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Per-problem local completion (keyed by title) ──
  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});

  // ── Sidebar & Navigation ──
  const [activeTrack, setActiveTrack] = useState(DSA_TRACKS[0].id);
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({ [DSA_TRACKS[0].subtopics[0].name]: true });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');

  // ── Code Sandbox ──
  const [sandboxProblem, setSandboxProblem] = useState<any>(null);
  const [lang, setLang] = useState<'python' | 'javascript' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  // Load DB questions for completion tracking
  useEffect(() => {
    api.get('/questions?category=dsa&limit=1000')
      .then(res => { if (res.data?.success) setDbProblems(res.data.questions); })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load local completions from localStorage
    const saved = localStorage.getItem('dsa_completions');
    if (saved) setLocalCompleted(JSON.parse(saved));
  }, []);

  const currentTrack = DSA_TRACKS.find(t => t.id === activeTrack)!;

  // ── Completion helpers ──
  const isProblemDone = (title: string) => localCompleted[title] || false;

  const toggleDone = (title: string) => {
    setLocalCompleted(prev => {
      const next = { ...prev, [title]: !prev[title] };
      localStorage.setItem('dsa_completions', JSON.stringify(next));
      return next;
    });
  };

  // ── Stats per track ──
  const trackStats = (track: typeof DSA_TRACKS[0]) => {
    const total = track.subtopics.reduce((s, st) => s + st.problems.length, 0);
    const done  = track.subtopics.reduce((s, st) =>
      s + st.problems.filter(p => isProblemDone(p.title)).length, 0);
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  // ── Overall stats ──
  const overallTotal = DSA_TRACKS.reduce((s, t) =>
    s + t.subtopics.reduce((ss, st) => ss + st.problems.length, 0), 0);
  const overallDone = DSA_TRACKS.reduce((s, t) =>
    s + t.subtopics.reduce((ss, st) =>
      ss + st.problems.filter(p => isProblemDone(p.title)).length, 0), 0);
  const overallPct = overallTotal > 0 ? Math.round((overallDone / overallTotal) * 100) : 0;

  // ── Sandbox ──
  const openSandbox = (prob: any) => {
    setSandboxProblem(prob);
    setCode(STARTER[lang]);
    setOutput('');
  };

  useEffect(() => {
    if (sandboxProblem) setCode(STARTER[lang]);
  }, [lang, sandboxProblem]);

  const runCode = async () => {
    setRunning(true);
    setOutput('⏳ Compiling...');
    await new Promise(r => setTimeout(r, 700));
    if (lang === 'javascript') {
      try {
        const logs: string[] = [];
        const mockConsole = { log: (...a: any[]) => logs.push(a.join(' ')) };
        const fn = new Function('console', code + '\nreturn typeof solution === "function" ? solution() : undefined;');
        fn(mockConsole);
        setOutput(`✅ Success\n\n${logs.join('\n') || '(No output)'}\n\n⚡ ~${Math.random() * 5 + 1 | 0}ms`);
      } catch (e: any) {
        setOutput(`❌ Error: ${e.message}`);
      }
    } else {
      setOutput(`✅ Build Succeeded\n\nSimulated output for ${lang}\n[Your logic would execute here]\n\n⚡ Runtime: ~${(Math.random() * 12 + 2) | 0}ms`);
    }
    setRunning(false);
  };

  // ── Search filter ──
  const filteredProblems = (problems: any[]) =>
    !search ? problems : problems.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const filteredSubs = currentTrack.subtopics.filter(st =>
    filteredProblems(st.problems).length > 0
  );

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: 0, position: 'relative' }}>

      {/* ── Left Sidebar: Track Navigator ── */}
      <div style={{
        width: sidebarOpen ? 260 : 0,
        minWidth: sidebarOpen ? 260 : 0,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-secondary)',
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'linear-gradient(135deg,#6366f1,#ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Binary size={14} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>PLACEMENT</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: -2 }}>DSA Tracks</div>
            </div>
          </div>

          {/* Overall progress */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '10px 12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 600 }}>
              <span>OVERALL PROGRESS</span>
              <span style={{ color: 'var(--accent-emerald-light)', fontWeight: 700 }}>{overallDone}/{overallTotal}</span>
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${overallPct}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#ec4899)', borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{overallPct}% complete</div>
          </div>
        </div>

        {/* Track list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          {DSA_TRACKS.map(track => {
            const stats = trackStats(track);
            const isActive = activeTrack === track.id;
            return (
              <div
                key={track.id}
                onClick={() => { setActiveTrack(track.id); setExpandedSubs({ [track.subtopics[0]?.name]: true }); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 2,
                  background: isActive ? `${track.color}18` : 'transparent',
                  border: isActive ? `1px solid ${track.color}35` : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{track.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: isActive ? 700 : 500, color: isActive ? track.color : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${stats.pct}%`, height: '100%', background: track.color, transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>{stats.done}/{stats.total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Center: Problem List ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Track title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{currentTrack.icon}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>{currentTrack.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentTrack.description}</div>
            </div>
          </div>

          {/* Track stats pill */}
          {(() => {
            const s = trackStats(currentTrack);
            return (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={12} color="#34d399" />
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{s.done}</span>
                  <span>/ {s.total} solved</span>
                </div>
                <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: `linear-gradient(90deg,${currentTrack.color},${currentTrack.color}aa)`, transition: 'width 0.4s' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: currentTrack.color }}>{s.pct}%</span>
              </div>
            );
          })()}
        </div>

        {/* Search */}
        <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input-field"
              placeholder={`Search in ${currentTrack.name}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 30, fontSize: 12.5, height: 34 }}
            />
          </div>
        </div>

        {/* Problem list grouped by subtopics */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredSubs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              No problems found for "{search}"
            </div>
          )}

          {filteredSubs.map((subtopic, si) => {
            const probs = filteredProblems(subtopic.problems);
            const subDone = probs.filter(p => isProblemDone(p.title)).length;
            const isExpanded = expandedSubs[subtopic.name] ?? si === 0;

            return (
              <div key={subtopic.name} style={{ borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                {/* Subtopic header */}
                <div
                  onClick={() => setExpandedSubs(prev => ({ ...prev, [subtopic.name]: !isExpanded }))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 16px', cursor: 'pointer', background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: currentTrack.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{subtopic.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 99, border: '1px solid var(--border)' }}>
                      {probs.length} problems
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {subDone > 0 && (
                      <span style={{ fontSize: 10, color: '#34d399', fontWeight: 700 }}>
                        {subDone}/{probs.length} ✓
                      </span>
                    )}
                    {isExpanded ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Problems list — one by one */}
                {isExpanded && (
                  <div>
                    {probs.map((prob, idx) => {
                      const done = isProblemDone(prob.title);
                      const diff = DIFF_COLORS[prob.difficulty] || DIFF_COLORS.Easy;

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 16px',
                            borderBottom: idx < probs.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                            background: done ? 'rgba(16,185,129,0.03)' : 'transparent',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          {/* Serial number */}
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, width: 20, textAlign: 'right', flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>

                          {/* Checkbox */}
                          <button
                            onClick={() => toggleDone(prob.title)}
                            style={{
                              width: 20, height: 20, borderRadius: 5, border: done ? 'none' : '1.5px solid var(--border-bright)',
                              background: done ? '#10b981' : 'transparent', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, transition: 'all 0.2s ease',
                            }}
                          >
                            {done && <Check size={11} color="#fff" strokeWidth={3} />}
                          </button>

                          {/* Title */}
                          <span style={{
                            flex: 1, fontSize: 13, fontWeight: done ? 400 : 500,
                            color: done ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: done ? 'line-through' : 'none',
                            lineHeight: 1.4,
                          }}>
                            {prob.title}
                          </span>

                          {/* Difficulty badge */}
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                            background: diff.bg, color: diff.text, flexShrink: 0,
                          }}>
                            {prob.difficulty}
                          </span>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            {prob.link && (
                              <a
                                href={prob.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open problem"
                                style={{
                                  width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: 'var(--text-muted)', textDecoration: 'none',
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = currentTrack.color; (e.currentTarget as HTMLElement).style.color = currentTrack.color; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                              >
                                <ExternalLink size={11} />
                              </a>
                            )}
                            <button
                              onClick={() => openSandbox(prob)}
                              title="Open code editor"
                              style={{
                                width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
                                background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-muted)', transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLElement).style.color = '#6366f1'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                            >
                              <Code size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel: Code Sandbox ── */}
      {sandboxProblem && (
        <div style={{
          width: 540, borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <style>{`
            @keyframes slideInRight { from { transform: translateX(30px); opacity:0; } to { transform: translateX(0); opacity:1; } }
          `}</style>

          {/* Sandbox header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Terminal size={14} color="#6366f1" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sandboxProblem.title}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Code Sandbox</div>
            </div>
            <button onClick={() => setSandboxProblem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 4, display: 'flex' }}>
              <X size={14} />
            </button>
          </div>

          {/* Language selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '8px 12px', gap: 4 }}>
            {(['python', 'javascript', 'cpp', 'java'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  border: 'none', fontFamily: 'JetBrains Mono, monospace',
                  background: lang === l ? '#6366f1' : 'rgba(255,255,255,0.04)',
                  color: lang === l ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}
              >
                {l === 'javascript' ? 'JS' : l === 'python' ? 'PY' : l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <MonacoEditor
              height="100%"
              language={lang === 'javascript' ? 'javascript' : lang === 'python' ? 'python' : lang === 'cpp' ? 'cpp' : 'java'}
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 13, fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false }, lineNumbers: 'on',
                scrollBeyondLastLine: false, automaticLayout: true,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Output panel */}
          <div style={{ height: 140, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '6px 14px', borderBottom: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              OUTPUT
            </div>
            <pre style={{ flex: 1, overflowY: 'auto', padding: '8px 14px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: output.startsWith('❌') ? '#f87171' : output.startsWith('✅') ? '#34d399' : 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              {output || '// Click Run to execute your code'}
            </pre>
          </div>

          {/* Action bar */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={runCode}
              disabled={running}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px',
                background: running ? 'rgba(99,102,241,0.3)' : '#6366f1',
                border: 'none', borderRadius: 7, color: '#fff', cursor: running ? 'not-allowed' : 'pointer',
                fontSize: 12, fontWeight: 700, transition: 'background 0.15s',
              }}
            >
              <Play size={12} /> {running ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={() => { toggleDone(sandboxProblem.title); setSandboxProblem(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 7, color: '#34d399', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              }}
            >
              <Check size={12} /> Mark Solved
            </button>
            {sandboxProblem.link && (
              <a
                href={sandboxProblem.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  borderRadius: 7, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12,
                }}
              >
                <ExternalLink size={11} /> Problem
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
