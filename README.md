AlgoVisualizer

Interactive web-based platform to visualize popular algorithms step-by-step. Learn algorithms visually with smooth animations for sorting, searching, graph traversal, dynamic programming, and string/pattern algorithms.

Features

Visualize 10+ popular algorithms in computer science.

Step-by-step animation with Play, Pause, Step Forward, Step Backward controls.

Interactive array, graph, string, and DP table visualizations.

Clean, responsive, and beginner-friendly UI.

Easily extendable to add more algorithms.

Algorithms Included (v0)
Sorting

Bubble Sort

Merge Sort

Heap Sort

Searching

Linear Search

Binary Search

Graph Algorithms

BFS (Breadth-First Search)

DFS (Depth-First Search)

Dijkstra’s Algorithm

Dynamic Programming / Math

Fibonacci (DP approach)

Knapsack Problem

String / Pattern Matching

KMP Algorithm

(More algorithms will be added in future versions.)

Installation
# Clone the repository
git clone https://github.com/yourusername/AlgoVisualizer.git

# Navigate into the project folder
cd AlgoVisualizer

# Install dependencies
npm install

# Start the development server
npm start


Open http://localhost:3000 in your browser to see the visualizer in action.

Usage

Select an algorithm from the dropdown menu.

Input your dataset:

Array (sorting/searching)

Graph (nodes/edges for BFS, DFS, Dijkstra)

Strings for KMP

Weights/values for Knapsack

Use the controls to animate the algorithm step-by-step.

Observe the algorithm behavior and learn efficiently!

Tech Stack

Frontend: React.js

Visualization: D3.js / Canvas / SVG

Styling: CSS / Tailwind (optional)

Language: JavaScript

Contributing

Contributions are welcome!

Add new algorithms by creating a steps generator function.

Improve existing visualizations.

Enhance UI/UX and add features like speed control, themes, or additional interactivity.

Future Plans

Add more algorithms (Topological Sort, Bellman-Ford, Radix Sort, Segment Tree, etc.)

Allow custom user graphs and arrays for practice.

Add themes, dark mode, and mobile support.

Export animations as GIF or video.
