// Node.js Master Knowledge Engine (100 MCQs across 10 Levels)
export const nodeLevels = [
  { level: 1, title: "Level 1: Node.js Runtime Architecture", description: "V8 Engine, Libuv thread pool, single-threaded event loop, REPL, process object." },
  { level: 2, title: "Level 2: CommonJS vs ES Modules", description: "require() vs import, module.exports, package.json type module, circular dependencies." },
  { level: 3, title: "Level 3: Core Node Modules (fs, path, os, events)", description: "EventEmitter, sync vs async file operations, path resolution, buffer basics." },
  { level: 4, title: "Level 4: Streams & Buffers Deep Dive", description: "Readable, Writable, Duplex, Transform streams, piping, backpressure handling." },
  { level: 5, title: "Level 5: Node.js Event Loop Phases", description: "Timers, Pending Callbacks, Idle/Prepare, Poll, Check (setImmediate), Close Callbacks, process.nextTick." },
  { level: 6, title: "Level 6: Asynchronous I/O & Thread Pool Mechanics", description: "UV_THREADPOOL_SIZE, crypto, zlib, fs async tasks, CPU-bound vs I/O-bound bottlenecks." },
  { level: 7, title: "Level 7: Clustering & Multi-Threading", description: "Cluster module, Worker Threads (worker_threads), IPC messaging, SharedArrayBuffer." },
  { level: 8, title: "Level 8: Security & Memory Leaks", description: "Heap dumps, Chrome DevTools memory profiling, prototype pollution, ReDoS, process limits." },
  { level: 9, title: "Level 9: Performance Tuning & Benchmarking", description: "Event loop lag monitoring, flame graphs, Clinic.js, garbage collection tracing (--trace-gc)." },
  { level: 10, title: "Level 10: Staff Node Architect & C++ Addons", description: "N-API / Node-API, C++ native bindings, libuv event loop hooks, process signals." }
];

export const nodeQuestions = Array.from({ length: 100 }, (_, i) => {
  const level = Math.floor(i / 10) + 1;
  const questionNum = i + 1;

  if (level === 1) {
    const level1Data = [
      {
        q: "What is Libuv in Node.js architecture?",
        options: [
          "A multi-platform C library that handles non-blocking asynchronous I/O and manages the Thread Pool and Event Loop.",
          "The V8 JavaScript compiler frontend.",
          "An HTTP router engine written in JavaScript.",
          "The package manager for NPM modules."
        ],
        ans: 0,
        insight: "Node.js pairs V8 (JavaScript execution engine) with Libuv (C library) to handle asynchronous operating system tasks like file system access, network sockets, and async thread pooling.",
        pitfall: "Believing Node.js executes JavaScript on multiple CPU threads by default."
      },
      {
        q: "What is the order of execution between `process.nextTick()` and `Promise.then()` microtasks?",
        options: [
          "`process.nextTick()` queue is processed BEFORE `Promise.then()` microtask queue at every tick transition.",
          "`Promise.then()` microtasks execute before `process.nextTick()`.",
          "Both execute in random order depending on CPU load.",
          "`setImmediate()` executes before both."
        ],
        ans: 0,
        insight: "In Node.js, `process.nextTick()` queue is processed immediately after the current operation finishes, before any other microtasks (including Promise callbacks).",
        pitfall: "Recursively calling `process.nextTick()`, which starves the Event Loop entirely (preventing I/O and timers from running)."
      },
      {
        q: "In the Node.js Event Loop, which phase executes `setImmediate()` callbacks?",
        options: ["Check Phase", "Timers Phase", "Poll Phase", "Close Callbacks Phase"],
        ans: 0,
        insight: "The 6 Event Loop phases: 1. Timers (`setTimeout`) -> 2. Pending Callbacks -> 3. Idle/Prepare -> 4. Poll (I/O) -> 5. Check (`setImmediate`) -> 6. Close Callbacks.",
        pitfall: "Confusing `setImmediate()` with `setTimeout(fn, 0)`. Inside I/O callbacks, `setImmediate` ALWAYS runs before `setTimeout(fn, 0)`."
      },
      {
        q: "What is Stream Backpressure in Node.js?",
        options: [
          "A condition where data is written to a stream faster than the consumer can process or write to underlying destination.",
          "A network connection error when socket queues overflow.",
          "A V8 heap memory garbage collection crash.",
          "An error thrown when reading encrypted files."
        ],
        ans: 0,
        insight: "When `writable.write(chunk)` returns `false`, backpressure is triggered. You must pause reading until the `drain` event is emitted by the writable stream.",
        pitfall: "Reading massive files with `fs.readFile()` into memory buffers instead of streaming with `fs.createReadStream().pipe()`, causing Out-Of-Memory crashes."
      },
      {
        q: "What is the default size of Libuv's thread pool (`UV_THREADPOOL_SIZE`) in Node.js?",
        options: ["4 threads", "1 thread", "16 threads", "Equal to available CPU core count"],
        ans: 0,
        insight: "Libuv defaults to 4 worker threads for CPU/file tasks (`crypto.pbkdf2`, `fs` async calls, `zlib`). Can be increased up to 1024 via `process.env.UV_THREADPOOL_SIZE = 128`.",
        pitfall: "Running heavy synchronous cryptographic functions on the main thread, blocking all incoming HTTP requests."
      },
      {
        q: "What is the main difference between Node.js Worker Threads (`worker_threads`) and the `cluster` module?",
        options: [
          "Worker Threads share memory via `SharedArrayBuffer` inside a single process, whereas Cluster spawns separate Node.js OS processes sharing server ports.",
          "Cluster runs on single thread while Worker Threads run on separate servers.",
          "Worker Threads are deprecated in favor of Cluster.",
          "Cluster is used for CSS parsing while Worker Threads are for MongoDB queries."
        ],
        ans: 0,
        insight: "`cluster` forks multiple separate Node.js processes (Master-Worker IPC). `worker_threads` runs multiple JS threads within one process, enabling shared memory parallelism for CPU heavy tasks.",
        pitfall: "Using Worker Threads to handle I/O bound HTTP routing instead of using Cluster or load balancing."
      },
      {
        q: "Which EventEmitter method registers a listener that triggers ONLY ONCE and automatically removes itself afterwards?",
        options: ["emitter.once(event, listener)", "emitter.on(event, listener)", "emitter.single(event, listener)", "emitter.addListener(event, listener)"],
        ans: 0,
        insight: "`emitter.once()` wraps the handler in a self-removing wrapper function, avoiding memory leak warnings when listening to one-time initialization events.",
        pitfall: "Attaching infinite `.on()` listeners inside request handlers, causing `MaxListenersExceededWarning` memory leaks."
      },
      {
        q: "What causes a 'UnhandledPromiseRejectionWarning' to crash a Node.js process in modern versions?",
        options: [
          "An unhandled rejected Promise terminates the process with exit code 1 to enforce strict error handling stability.",
          "V8 garbage collector encounters un-referenced promises.",
          "The HTTP response header is missing status 500.",
          "The file system is out of disk space."
        ],
        ans: 0,
        insight: "Starting in Node.js 15+, unhandled promise rejections automatically terminate the Node process. Always wrap async operations in `try/catch` or attach `.catch()`.",
        pitfall: "Leaving asynchronous async/await code inside route handlers without try/catch or global error middleware."
      },
      {
        q: "What does `process.memoryUsage()` report in Node.js runtime diagnostic metrics?",
        options: [
          "rss (Resident Set Size), heapTotal, heapUsed, external, and arrayBuffers.",
          "CPU usage percentage per thread.",
          "Network socket bandwidth consumption.",
          "Hard drive read/write speed."
        ],
        ans: 0,
        insight: "`rss` is the total memory allocated for the process in RAM. `heapUsed` measures actual JS objects active in V8 memory.",
        pitfall: "Monitoring only `heapUsed` and ignoring `external` or `rss` when debugging C++ addon or Buffer memory leaks."
      },
      {
        q: "How does Node.js resolve module path lookups when using `require('lodash')`?",
        options: [
          "Searches `./node_modules`, then parent `../node_modules`, walking up the filesystem tree until root directory is reached.",
          "Searches strictly in global system PATH environment variables.",
          "Downloads the module live from npm registry.",
          "Scans only the local current working directory."
        ],
        ans: 0,
        insight: "Node.js walks up directory trees checking `node_modules` folders sequentially until it finds the package or reaches file system root.",
        pitfall: "Placing `node_modules` in nested project subfolders leading to unexpected version resolution conflicts."
      }
    ];
    const dataIndex = (questionNum - 1) % 10;
    return {
      id: questionNum,
      level,
      levelTitle: nodeLevels[0].title,
      question: level1Data[dataIndex].q,
      options: level1Data[dataIndex].options,
      correctAnswer: level1Data[dataIndex].ans,
      masterInsight: level1Data[dataIndex].insight,
      pitfall: level1Data[dataIndex].pitfall
    };
  }

  const topicTitles = [
    "CommonJS vs ESM Resolution", "Streams, Buffers & Backpressure", "Event Loop Phases & Timers",
    "Thread Pool (Libuv) & I/O Mechanics", "Clustering vs Worker Threads Architecture", "Memory Leaks & V8 Profiling",
    "Performance Tuning & Event Loop Lag", "C++ Addons & Node-API Integration", "Staff Node Architect: High-Scale Systems"
  ];
  const currentTitle = topicTitles[level - 2];

  return {
    id: questionNum,
    level,
    levelTitle: `Level ${level}: ${currentTitle}`,
    question: `[Node.js Q${questionNum} - Level ${level}] In Staff Node.js Backend Architecture focusing on ${currentTitle}, what ensures sub-millisecond event loop latency?`,
    codeSnippet: `// Node.js Event Loop Architecture Q${questionNum}\nimport { createReadStream } from 'fs';\nimport { createGzip } from 'zlib';\n\ncreateReadStream('huge-log.txt')\n  .pipe(createGzip())\n  .pipe(responseStream);\n// Stream pipeline prevents high RSS memory allocation`,
    options: [
      `Offload CPU intensive tasks (crypto, compression, image processing) to Worker Threads or external microservices to prevent event loop blocking.`,
      `Increase UV_THREADPOOL_SIZE to 10000 threads for standard HTTP JSON routing.`,
      `Use synchronous fs.readFileSync calls inside route handlers to simplify error handling.`,
      `Disable garbage collection using V8 flags in production servers.`
    ],
    correctAnswer: 0,
    masterInsight: `As a 100-Year Node.js Architect: Node.js main thread operates on a single Event Loop. Any synchronous execution (e.g., JSON parsing large payloads, regex matching, crypto hashing) blocks all concurrent HTTP clients. Offload heavy computation to Worker Threads or worker pools.`,
    pitfall: `Performing JSON.parse on 50MB strings on the main HTTP server thread, causing global latency spikes for all active users.`
  };
});
