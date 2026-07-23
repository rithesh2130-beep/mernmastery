// Top Interview Questions & Answers Bank (Senior & Staff Level MERN Stack)
export const interviewBank = {
  html: [
    {
      id: "html-int-1",
      topic: "HTML5",
      title: "Explain HTML5 Semantic Elements, A11y, and Why <div> Heavy Layouts Harm Applications.",
      difficulty: "Senior",
      question: "Why are semantic HTML elements crucial for modern web applications, and how do they impact DOM parsing, SEO, and screen reader accessibility?",
      answer: "Semantic elements (`<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<main>`) clearly describe their meaning to both browser parsers, search engines, and assistive technologies. Using generic `<div>` elements strips out accessibility landmarks from the Accessibility Tree.",
      code: `<!-- Non-Semantic anti-pattern -->\n<div class="header">\n  <div class="nav">...</div>\n</div>\n\n<!-- Semantic Architecture pattern -->\n<header role="banner">\n  <nav aria-label="Main Navigation">\n    <ul><li><a href="/dashboard">Dashboard</a></li></ul>\n  </nav>\n</header>`,
      teacherTip: "In an interview, mention the Accessibility Tree (A11y Tree). Browsers compile HTML DOM into an Accessibility Tree. Using semantic elements automatically maps nodes to ARIA roles without manual attribute boilerplate.",
      trap: "Don't confuse `<section>` with `<article>`. An `<article>` is a self-contained entity that makes sense on its own (like a blog post or news item). A `<section>` is a thematic grouping of content."
    },
    {
      id: "html-int-2",
      topic: "HTML5",
      title: "Difference between `script async` vs `script defer` execution.",
      difficulty: "Senior",
      question: "Detailed comparison between standard `<script>`, `<script async>`, and `<script defer>` parsing & execution timelines.",
      answer: "Standard `<script>` halts HTML parsing while downloading and executing. `<script async>` downloads in parallel with parsing, but pauses parsing to execute immediately once downloaded. `<script defer>` downloads in parallel and executes ONLY after HTML parsing is completely finished, maintaining DOM order.",
      code: `<!-- Blocks DOM Parser completely -->\n<script src="app.js"></script>\n\n<!-- Executes ASAP when fetched (Unordered execution) -->\n<script async src="analytics.js"></script>\n\n<!-- Executes after DOM parse finished (Preserves order) -->\n<script defer src="react-bundle.js"></script>`,
      teacherTip: "Always recommend `defer` for scripts that depend on DOM structure or order (like main application bundles). Recommend `async` for independent third-party scripts (like analytics or tracking pixels).",
      trap: "Believing `async` preserves script order. If script A is `async` and 100KB, and script B is `async` and 5KB, script B will execute BEFORE script A!"
    }
  ],
  css: [
    {
      id: "css-int-1",
      topic: "CSS3",
      title: "Reflow vs Repaint vs Composite: Browser Rendering Pipeline",
      difficulty: "Staff",
      question: "Explain the browser pixel pipeline (Layout/Reflow -> Paint -> Composite) and how to write 60fps buttery animations.",
      answer: "The browser pipeline consists of: 1. JS/CSS execution -> 2. Style calculation -> 3. Layout (Reflow: computing geometry/positions) -> 4. Paint (Repaint: filling in pixels, colors, text) -> 5. Composite (layer composition on GPU). Modifying layout properties (`width`, `top`, `margin`) triggers costly Reflow + Repaint + Composite. Modifying `transform` or `opacity` bypasses Reflow and Repaint, running directly on GPU Compositor.",
      code: `/* BAD PERFORMANCE: Triggers Reflow & Repaint */\n.box:hover {\n  top: 10px; /* Triggers geometry recalculation */\n  width: 300px;\n}\n\n/* OPTIMAL PERFORMANCE: GPU Layer Composite Only */\n.box:hover {\n  transform: translate3d(0, 10px, 0) scale(1.05);\n  will-change: transform;\n}`,
      teacherTip: "Highlight `will-change: transform`. Tell the interviewer that `will-change` hints the browser engine to promote the element to a hardware-accelerated GPU layer beforehand, preventing dynamic layer creation lag.",
      trap: "Overusing `will-change` on hundreds of elements simultaneously, which consumes excessive VRAM memory and degrades mobile rendering."
    },
    {
      id: "css-int-2",
      topic: "CSS3",
      title: "Flexbox vs CSS Grid Architecture & Container Queries",
      difficulty: "Senior",
      question: "When should a senior front-end architect choose CSS Grid versus Flexbox, and how do Container Queries revolutionize responsive component design?",
      answer: "Flexbox is designed for 1-Dimensional content flow (either row OR column). Grid is designed for 2-Dimensional layout alignment (rows AND columns simultaneously). Container Queries (`@container`) allow components to adapt their CSS based on their parent container's width, rather than the viewport size (`@media`).",
      code: `/* Container Query Component */\n.card-wrapper {\n  container-type: inline-size;\n  container-name: cardContainer;\n}\n\n@container cardContainer (min-width: 450px) {\n  .card {\n    display: grid;\n    grid-template-columns: 1fr 2fr;\n  }\n}`,
      teacherTip: "Emphasize modular micro-frontend architecture: Container queries allow a card component to render in horizontal layout when placed in a wide main section, and vertical layout when placed in a narrow sidebar, without needing separate CSS classes!",
      trap: "Using CSS Grid for simple 3-button horizontal navigation bars where Flexbox `justify-content: space-between` is far cleaner."
    }
  ],
  js: [
    {
      id: "js-int-1",
      topic: "JavaScript",
      title: "Closures, Lexical Scope & Garbage Collection Memory Retention",
      difficulty: "Staff",
      question: "What is a closure under the hood in JavaScript engine memory, how is it created, and how can improper closure references lead to memory leaks?",
      answer: "A closure is the combination of a function bundled together with references to its surrounding lexical environment. Even after the outer function has returned, the inner function retains a reference to the outer scope scope chain object in heap memory. Memory leaks occur when inner closures hold references to massive outer variables that are never released.",
      code: `function createHeavyService() {\n  const hugeBuffer = new Array(10000000).fill("DATA");\n  \n  return {\n    getDataLength() {\n      return hugeBuffer.length; // hugeBuffer is closed over in heap memory\n    }\n  };\n}\n\nconst service = createHeavyService();\n// hugeBuffer stays in RAM as long as 'service' object reference lives!`,
      teacherTip: "Explain to the interviewer that V8 allocates a `Closure` scope object on the Heap when a inner function escapes the parent scope. Mention that modern V8 engines perform variable pruning, stripping unreferenced outer variables from the closure.",
      trap: "Believing closures are only created when using the `return` keyword. Closures are created EVERY time a function is declared within another function!"
    },
    {
      id: "js-int-2",
      topic: "JavaScript",
      title: "The Event Loop, Microtask Queue & Macrotask Execution Order",
      difficulty: "Staff",
      question: "Walk through the exact step-by-step console execution output of code containing setTimeout, Promises, queueMicrotask, and synchronous code.",
      answer: "Order of Execution: 1. Synchronous Code on Call Stack -> 2. Process ALL Microtasks in Microtask Queue (Promises, queueMicrotask, MutationObserver) until empty -> 3. Render / DOM updates -> 4. Pick NEXT ONE Macrotask from Macrotask Queue (setTimeout, setInterval, I/O) -> Repeat loop.",
      code: `console.log("1: Sync Start");\n\nsetTimeout(() => console.log("2: Timeout Macrotask"), 0);\n\nPromise.resolve().then(() => {\n  console.log("3: Promise Microtask 1");\n}).then(() => {\n  console.log("4: Promise Microtask 2");\n});\n\nconsole.log("5: Sync End");\n\n// Output: 1: Sync Start -> 5: Sync End -> 3: Promise Microtask 1 -> 4: Promise Microtask 2 -> 2: Timeout Macrotask`,
      teacherTip: "Note that chained promise `.then()` callbacks are queued immediately as microtasks as soon as the promise resolves, draining the microtask queue completely BEFORE `setTimeout` ever runs.",
      trap: "Thinking `setTimeout(fn, 0)` executes immediately at 0 milliseconds. It only schedules the callback into the Macrotask queue, waiting for the Call Stack AND Microtask Queue to completely clear first!"
    }
  ],
  react: [
    {
      id: "react-int-1",
      topic: "React.js",
      title: "React Fiber Architecture, Virtual DOM Reconciliation & Double Buffering",
      difficulty: "Staff",
      question: "What problem did React Fiber solve over the legacy Stack Reconciler, and how does Fiber enable concurrent rendering?",
      answer: "The legacy Stack Reconciler operated recursively and synchronously—once rendering started, it could not be interrupted, causing frame drops during large tree updates. Fiber re-architected reconciliation into a incremental work unit model using a singly-linked list tree. It enables Double Buffering (current tree vs workInProgress tree) and allows React to pause, yield to browser main thread events, and resume rendering.",
      code: `// Conceptual Fiber Node structure in React engine\ntype FiberNode = {\n  type: any,\n  key: null | string,\n  child: FiberNode | null,   // First child\n  sibling: FiberNode | null, // Next sibling\n  return: FiberNode | null,  // Parent node\n  alternate: FiberNode | null,// Work-in-progress double buffer link\n  flags: number              // Side-effect flags (Placement, Update, Deletion)\n};`,
      teacherTip: "Use the Double Buffering metaphor: Just like video game engines render the next frame on an off-screen buffer before swapping it to the display screen, React Fiber prepares the `workInProgress` tree off-screen before committing it to the real DOM in a single synchronous phase.",
      trap: "Saying 'Virtual DOM is faster than real DOM'. In reality, Virtual DOM adds memory overhead, but provides a declarative programming model and efficient selective DOM batch updates."
    },
    {
      id: "react-int-2",
      topic: "React.js",
      title: "React Server Components (RSC) vs Client Components & Hydration Boundary",
      difficulty: "Staff",
      question: "What is the architectural difference between React Server Components (RSC) and Client Components ('use client')?",
      answer: "React Server Components (RSC) execute ONLY on the server during request or build time. They zero-bundle size JavaScript sent to the browser, have direct access to backend databases/filesystems, and stream serialized JSON trees (RSC Payload) to the client. Client Components ('use client') ship JavaScript bundles to the browser for interactive state, event handlers (`onClick`), and browser APIs (`useState`, `useEffect`).",
      code: `// Server Component (Default in Next.js App Router)\n// Zero client JS bundle overhead!\nimport db from '@/lib/db';\n\nexport default async function UserProfile({ userId }) {\n  const user = await db.users.findUnique({ where: { id: userId } });\n  \n  return (\n    <div>\n      <h1>{user.name}</h1>\n      {/* Interactive Client Component boundary */}\n      <FollowButton userId={userId} />\n    </div>\n  );\n}`,
      teacherTip: "Clarify that 'use client' does NOT mean the component only renders in the client! Client components still pre-render to HTML on the server during initial page load, and then hydrate in the browser.",
      trap: "Putting database secret keys or server-only packages inside components marked with 'use client'."
    }
  ],
  mongo: [
    {
      id: "mongo-int-1",
      topic: "MongoDB",
      title: "Indexing Deep-Dive: B-Trees, ESR Rule & Explain Plan Diagnostics",
      difficulty: "Staff",
      question: "How do compound indexes work in MongoDB, how do you apply the ESR Rule, and how do you analyze `explain('executionStats')`?",
      answer: "MongoDB compound indexes use B-Tree data structures. The ESR Rule (Equality, Sort, Range) ensures that query engine scans minimal index keys. When inspecting `explain('executionStats')`, look for `nReturned` vs `totalKeysExamined` vs `totalDocsExamined`. An optimal index has `nReturned === totalKeysExamined` and `totalDocsExamined === 0` (Index Covered Query).",
      code: `// ESR Compound Index Definition\n// Equality: status = "ACTIVE"\n// Sort: createdAt = -1\n// Range: age >= 21\n\ndb.users.createIndex({\n  status: 1,    // Equality\n  createdAt: -1,// Sort\n  age: 1        // Range\n});`,
      teacherTip: "If `totalDocsExamined > 0` during a covered query test, or if `stage: 'COLLSCAN'` appears, the database is performing a full collection scan (scanning every document on disk), which degrades production database performance.",
      trap: "Creating separate single field indexes on 10 different fields thinking MongoDB will combine them efficiently. MongoDB usually only uses ONE index per collection scan (unless using `$or` with Index Intersection)."
    }
  ],
  node: [
    {
      id: "node-int-1",
      topic: "Node.js",
      title: "Event Loop Architecture & Sub-System Threads (Libuv)",
      difficulty: "Senior",
      question: "Is Node.js truly single-threaded? Explain how Libuv thread pool handles asynchronous filesystem, crypto, and DNS lookups.",
      answer: "Node.js JavaScript execution is single-threaded (Call Stack). However, Node.js runtime is MULTI-THREADED. Libuv maintains a default C thread pool (4 threads) to handle CPU-intensive or blocking OS tasks like `fs` operations, `crypto.pbkdf2`, `zlib` compression, and DNS `lookup`. Network sockets (HTTP, TCP) utilize OS kernel asynchronous epoll/kqueue mechanisms directly without occupying thread pool workers.",
      code: `import crypto from 'crypto';\n\n// These 4 run concurrently on Libuv Thread Pool (default 4 threads)\nfor (let i = 0; i < 4; i++) {\n  crypto.pbkdf2('pass', 'salt', 100000, 512, 'sha512', () => {\n    console.log(\`Hash \${i + 1} completed\`);\n  });\n}`,
      teacherTip: "Mention `process.env.UV_THREADPOOL_SIZE`. In high-throughput servers doing heavy encryption or image processing, increasing thread pool size prevents bottlenecks.",
      trap: "Thinking network HTTP requests use Libuv worker threads. Network I/O is handled non-blockingly at the OS kernel level via epoll (Linux), kqueue (macOS), or IOCP (Windows)."
    }
  ],
  express: [
    {
      id: "express-int-1",
      topic: "Express.js",
      title: "Middleware Chain Architecture, Error Propagation & Production Security Hardening",
      difficulty: "Senior",
      question: "Design an enterprise-grade Express middleware architecture with JWT verification, rate limiting, and centralized error handling.",
      answer: "Express executes middleware sequentially as a linked list stack. A production middleware pipeline must follow: 1. Global Security (Helmet, CORS) -> 2. Body Parsers (`express.json`) -> 3. Rate Limiters -> 4. Modular Routers -> 5. 404 Fallback -> 6. Centralized 4-parameter Error Middleware (`(err, req, res, next)`).",
      code: `import express from 'express';\nimport helmet from 'helmet';\nimport cors from 'cors';\n\nconst app = express();\n\napp.use(helmet());\napp.use(cors({ origin: 'https://myapp.com' }));\napp.use(express.json({ limit: '10kb' })); // Prevents DoS payload attacks\n\n// Protected Route with Async Handler\napp.get('/api/data', authMiddleware, async (req, res, next) => {\n  try {\n    const data = await fetchData();\n    res.json({ success: true, data });\n  } catch (error) {\n    next(error); // Passes async error to centralized error middleware\n  }\n});\n\n// Centralized 4-parameter Error Middleware\napp.use((err, req, res, next) => {\n  console.error('Unhandled Error:', err);\n  res.status(err.statusCode || 500).json({\n    status: 'error',\n    message: err.message || 'Internal Server Error'\n  });\n});`,
      teacherTip: "Highlight `express.json({ limit: '10kb' })`. Setting payload size limits prevents malicious clients from crashing server memory with massive multi-megabyte JSON payloads.",
      trap: "Forgetting to return after `res.json()` inside middleware conditional checks, causing headers to be sent twice error ('Cannot set headers after they are sent to the client')."
    }
  ]
};
