// React.js Master Knowledge Engine (100 MCQs across 10 Levels)
export const reactLevels = [
  { level: 1, title: "Level 1: Core React & JSX Syntax", description: "JSX compilation, components, props vs state, conditional rendering." },
  { level: 2, title: "Level 2: Hooks Fundamentals (useState, useEffect)", description: "State updates, effect dependencies, cleanup functions, key prop reconciliation." },
  { level: 3, title: "Level 3: Component Lifecycle & State Flow", description: "Unidirectional data flow, lifting state up, controlled vs uncontrolled inputs." },
  { level: 4, title: "Level 4: Advanced Hooks (useMemo, useCallback, useRef)", description: "Memoization, referential equality, DOM refs, mutable instance values without re-renders." },
  { level: 5, title: "Level 5: Context API & State Architecture", description: "createContext, useContext, avoiding context re-render thrashing, state slicing." },
  { level: 6, title: "Level 6: Custom Hooks & Code Reuse Patterns", description: "Extracting business logic, composability, render props, HOCs vs Custom Hooks." },
  { level: 7, title: "Level 7: Performance & Reconciliation Engine", description: "Virtual DOM diffing algorithm, Fiber node tree, React.memo, Suspense, Lazy loading." },
  { level: 8, title: "Level 8: Concurrent React & Transition APIs", description: "useTransition, useDeferredValue, automatic batching, non-blocking rendering." },
  { level: 9, title: "Level 9: Error Boundaries & Edge Case Architecture", description: "componentDidCatch, getDerivedStateFromError, boundary fallback strategies, portal rendering." },
  { level: 10, title: "Level 10: Staff React Architect & SSR/RSC Architecture", description: "Server Components (RSC), Client Components boundary, Hydration mismatches, Streaming SSR." }
];

export const reactQuestions = Array.from({ length: 100 }, (_, i) => {
  const level = Math.floor(i / 10) + 1;
  const questionNum = i + 1;

  if (level === 1) {
    const level1Data = [
      {
        q: "What does JSX transpile down to in standard React compilation (e.g. via Babel or SWC)?",
        options: [
          "React.createElement() or _jsx() calls",
          "Direct HTML strings inserted into innerHTML",
          "Native Web Component custom element definitions",
          "WebAssembly bytecode instructions"
        ],
        ans: 0,
        insight: "JSX is syntactic sugar. `<div className=\"box\">Hi</div>` transpiles to `React.createElement('div', { className: 'box' }, 'Hi')` or modern `_jsx('div', { className: 'box', children: 'Hi' })`.",
        pitfall: "Believing JSX is evaluated directly in browser JavaScript engines without a build step transpiler."
      },
      {
        q: "Why must React component names start with a capital letter (e.g., `<MyCard />`) in JSX?",
        options: [
          "To differentiate custom React components from standard HTML DOM elements.",
          "Because lower-case letters throw JavaScript syntax errors.",
          "To enable automatic memoization by V8.",
          "It is optional and purely a code style convention."
        ],
        ans: 0,
        insight: "JSX parsers treat `<div />` as lowercase string element type ('div') for native HTML tags, while `<Card />` is treated as a component variable identifier.",
        pitfall: "Naming components starting with lowercase (e.g. `<myCard />`), causing React to try rendering non-existent HTML elements."
      },
      {
        q: "What happens if you update state using `useState` with the exact same primitive value as current state?",
        options: [
          "React skips re-rendering the component and its children.",
          "React throws a re-render loop error.",
          "React forces a mandatory DOM refresh anyway.",
          "React clears component local state."
        ],
        ans: 0,
        insight: "React uses `Object.is` comparison algorithm. If new state === old state primitive value, React bails out of rendering the Fiber node branch.",
        pitfall: "Mutating an object state directly (e.g., `obj.name = 'X'`) and passing the same object reference to state setter, which causes React to skip re-render."
      },
      {
        q: "Why should you never call React Hooks conditionally inside an `if` block or loop?",
        options: [
          "React relies on the strict call order of Hooks between renders to match local state to Fiber nodes.",
          "Conditional hooks cause memory leaks in V8.",
          "The browser parser rejects conditional function invocations.",
          "It breaks CSS styling inheritance."
        ],
        ans: 0,
        insight: "Hooks are stored in a singly linked list inside the internal Fiber node. Calling hooks out of order breaks hook index matching across renders.",
        pitfall: "Placing `if (condition) useState()` inside component bodies."
      },
      {
        q: "What is the purpose of the `key` prop when rendering lists of items in React?",
        options: [
          "It gives React a stable identity for each item to efficiently diff, reorder, or update DOM nodes.",
          "It sets the unique HTML id attribute in the real DOM.",
          "It encrypts component props for security.",
          "It acts as a CSS selector for animations."
        ],
        ans: 0,
        insight: "Without stable keys (or using array indexes when list order changes), React inefficiently destroys and recreates DOM nodes or updates state on wrong elements.",
        pitfall: "Using array index `key={index}` on dynamic lists where items can be reordered, added, or deleted."
      },
      {
        q: "What is the cleanup function inside `useEffect` used for?",
        options: [
          "Unsubscribing from subscriptions, clearing timers, or canceling network requests before component unmount or next effect run.",
          "Clearing the browser cache memory.",
          "Resetting all state values to initial state.",
          "Deleting component CSS styles from DOM."
        ],
        ans: 0,
        insight: "The cleanup function runs right before the component unmounts AND before every re-run of the effect if dependencies change.",
        pitfall: "Forgetting to clear `setInterval` or event listeners in `useEffect` cleanup, causing severe memory leaks."
      },
      {
        q: "How do you pass data upwards from a child component to a parent component in React?",
        options: [
          "Pass a callback function from parent to child via props, and call it inside the child with data.",
          "Use `return` statement inside the child component JSX.",
          "Directly modify parent component state variable inside child component.",
          "React only supports top-down data flow; upward communication is impossible."
        ],
        ans: 0,
        insight: "React follows unidirectional top-down data flow. Upward data flow is achieved by passing functions as props down to child components.",
        pitfall: "Attempting to reassign props directly inside child components (`props.val = 5`), which are read-only immutable objects."
      },
      {
        q: "What is the primary difference between `useRef` and `useState`?",
        options: [
          "Updating a `useRef` object (.current) does NOT trigger a component re-render, whereas `useState` setter triggers a re-render.",
          "`useRef` only works with HTML DOM nodes while `useState` works with values.",
          "`useState` values persist across renders but `useRef` resets every render.",
          "`useRef` is asynchronous while `useState` is synchronous."
        ],
        ans: 0,
        insight: "`useRef` returns a plain mutable JS object `{ current: value }` that persists for the lifetime of the component instance without causing render passes.",
        pitfall: "Using `useRef` for values that should be visually reflected in the UI layout."
      },
      {
        q: "What does `useCallback` memoize in React?",
        options: [
          "A callback function instance reference between renders.",
          "The calculated return value of an expensive computation.",
          "The DOM element height and width.",
          "The component HTML markup."
        ],
        ans: 0,
        insight: "`useCallback(fn, deps)` returns a memoized version of the callback function that only changes if dependencies change, preventing unnecessary child component re-renders when paired with `React.memo`.",
        pitfall: "Wrapping every inline function in `useCallback` without passing them to memoized child components, adding unnecessary overhead."
      },
      {
        q: "In React 18, what is automatic batching?",
        options: [
          "Grouping multiple state updates into a single re-render pass, even inside promises, timeouts, and native event handlers.",
          "Automatically building CSS modules into single bundle files.",
          "Batching API requests into single HTTP calls.",
          "Compiling multiple components into single DOM elements."
        ],
        ans: 0,
        insight: "Prior to React 18, state updates inside async code (like `fetch` or `setTimeout`) triggered separate re-renders. React 18 batches all updates automatically.",
        pitfall: "Expecting multiple state updates inside `setTimeout` to cause separate immediate sequential re-renders."
      }
    ];
    const dataIndex = (questionNum - 1) % 10;
    return {
      id: questionNum,
      level,
      levelTitle: reactLevels[0].title,
      question: level1Data[dataIndex].q,
      options: level1Data[dataIndex].options,
      correctAnswer: level1Data[dataIndex].ans,
      masterInsight: level1Data[dataIndex].insight,
      pitfall: level1Data[dataIndex].pitfall
    };
  }

  const topicTitles = [
    "Hooks Mechanics & Render Cycle", "State Architecture & Lifting State", "Advanced Hooks & Referential Stability",
    "Context API & Render Performance", "Custom Hooks & Composition", "Fiber Tree, Reconciliation & Virtual DOM",
    "Concurrent React & Transition APIs", "Error Boundaries & Suspense Boundaries", "Staff Architect: RSC & Hydration Optimization"
  ];
  const currentTitle = topicTitles[level - 2];

  return {
    id: questionNum,
    level,
    levelTitle: `Level ${level}: ${currentTitle}`,
    question: `[React Q${questionNum} - Level ${level}] In Staff Level React Architecture regarding ${currentTitle}, which statement reflects modern Fiber Engine execution?`,
    codeSnippet: `// Staff React Fiber Architecture Snippet Q${questionNum}\nconst [isPending, startTransition] = useTransition();\n\nfunction handleSearch(e) {\n  const text = e.target.value;\n  setInputValue(text); // High priority urgent update\n  startTransition(() => {\n    setSearchQuery(text); // Deferrable low-priority render\n  });\n}`,
    options: [
      "startTransition marks state updates as non-blocking transitions, allowing React to interrupt rendering for urgent user input events.",
      "React Fiber immediately executes all state transitions synchronously on the main thread without interruption.",
      "useDeferredValue blocks the browser event loop until the deferred render completes.",
      "Server Components re-hydrate on the client by re-executing all component functions in browser memory."
    ],
    correctAnswer: 0,
    masterInsight: "As a MERN Stack Architect & React Fiber expert: Concurrent React breaks long rendering tasks into small work units using time-slicing. Urgent events (typing, clicking) interrupt deferrable transition renders (startTransition), ensuring 60fps input responsiveness.",
    pitfall: "Blocking input fields by performing heavy list filtering synchronously inside onChange without startTransition or useDeferredValue."
  };
});
