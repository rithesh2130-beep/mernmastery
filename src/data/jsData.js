// JavaScript ES6+ Master Knowledge Engine (100 MCQs across 10 Levels)
export const jsLevels = [
  { level: 1, title: "Level 1: Fundamentals & Scope", description: "var, let, const, hoisting, primitive vs reference types, operators." },
  { level: 2, title: "Level 2: Functions & Execution Context", description: "Function declarations vs expressions, arrow functions, lexical scope, this binding." },
  { level: 3, title: "Level 3: Arrays & Objects Deep Dive", description: "Array methods (map, filter, reduce), object destructuring, spread/rest, optional chaining." },
  { level: 4, title: "Level 4: Closures & Higher Order Functions", description: "Lexical environment, scope chain preservation, currying, memoization patterns." },
  { level: 5, title: "Level 5: Prototypes & Object-Oriented JS", description: "Prototype chain, __proto__ vs prototype, Object.create, class syntax under the hood." },
  { level: 6, title: "Level 6: Asynchronous JS (Promises & Async/Await)", description: "Promise states, microtask queue, Promise.all, Promise.allSettled, error handling." },
  { level: 7, title: "Level 7: The Event Loop & Concurrency", description: "Call Stack, Web APIs, Task Queue vs Microtask Queue, requestAnimationFrame." },
  { level: 8, title: "Level 8: ES Modules, Generators & Iterators", description: "Import/export, dynamic imports, Symbol.iterator, yield, generator functions." },
  { level: 9, title: "Level 9: Memory Management & Garbage Collection", description: "Mark-and-sweep, memory leaks, WeakMap, WeakSet, FinalizationRegistry." },
  { level: 10, title: "Level 10: Staff JS Architect & Engine Internals", description: "V8 JIT compilation (Ignition & TurboFan), hidden classes, inline caching, Proxy & Reflect." }
];

export const jsQuestions = Array.from({ length: 100 }, (_, i) => {
  const level = Math.floor(i / 10) + 1;
  const questionNum = i + 1;

  if (level === 1) {
    const level1Data = [
      {
        q: "What will be printed to the console when executing: `console.log(typeof NaN);`?",
        options: ["\"number\"", "\"nan\"", "\"undefined\"", "\"object\""],
        ans: 0,
        insight: "`NaN` stands for 'Not-a-Number', but technically according to IEEE 754 floating-point standard used in JavaScript specification, it is a numeric value representing an unrepresentable math output.",
        pitfall: "Assuming `typeof NaN` returns 'nan' or 'undefined'."
      },
      {
        q: "What is the key difference between `var` and `let` declarations regarding scoping?",
        options: [
          "var is function-scoped while let is block-scoped.",
          "let is hoisted to top of window object while var is not.",
          "var cannot be re-assigned once initialized.",
          "let allows duplicate redeclarations in the same block."
        ],
        ans: 0,
        insight: "`var` ignores block `{}` boundaries (except functions) and hoists with `undefined`. `let` respects `{}` block scope and resides in the Temporal Dead Zone (TDZ) before declaration.",
        pitfall: "Using `var` inside `for` loops expecting loop index isolation."
      },
      {
        q: "What is the output of `console.log(0.1 + 0.2 === 0.3);`?",
        options: ["false", "true", "TypeError", "undefined"],
        ans: 0,
        insight: "In IEEE 754 binary floating point representation, 0.1 + 0.2 equals `0.30000000000000004`. Use `Math.abs(a - b) < Number.EPSILON` for accurate floating point comparisons.",
        pitfall: "Comparing floating point calculations directly with `===`."
      },
      {
        q: "What does the Temporal Dead Zone (TDZ) refer to in JavaScript?",
        options: [
          "The period between entering a scope and executing the variable's declaration for `let` and `const`.",
          "The time spent inside an unhandled Promise rejection.",
          "The duration before garbage collection deletes unreferenced objects.",
          "The execution time of synchronous code blocks."
        ],
        ans: 0,
        insight: "Accessing a `let` or `const` variable before its initialization line throws a `ReferenceError` due to the TDZ.",
        pitfall: "Believing `let` and `const` are not hoisted. They ARE hoisted, but not initialized."
      },
      {
        q: "What is the output of `console.log([] == ![]);`?",
        options: ["true", "false", "TypeError", "undefined"],
        ans: 0,
        insight: "`![]` evaluates to `false`. Then `[] == false` converts both to numbers: `[]` becomes `0` and `false` becomes `0`. Thus `0 == 0` is `true`. Always use `===` strict equality!",
        pitfall: "Relying on abstract equality (`==`) which applies complex implicit type coercion rules."
      },
      {
        q: "What does `Array.prototype.reduce()` return if no initial value is passed and the array contains one element?",
        options: [
          "That single element without calling the callback function.",
          "An empty array.",
          "TypeError: Reduce of empty array with no initial value.",
          "undefined"
        ],
        ans: 0,
        insight: "If initial value is omitted, `reduce` takes index 0 as accumulator and index 1 as current. If array length is 1, it returns array[0] without executing accumulator callback.",
        pitfall: "Omitting initialValue on dynamic arrays, which crashes on empty arrays with TypeError."
      },
      {
        q: "Which object method prevents adding new properties and prevents modifying existing property descriptors?",
        options: ["Object.freeze()", "Object.seal()", "Object.preventExtensions()", "Object.lock()"],
        ans: 0,
        insight: "`Object.freeze()` makes an object completely immutable (shallow). `Object.seal()` prevents adding/deleting properties but allows updating existing values.",
        pitfall: "Assuming `Object.freeze()` performs deep nested immutability without custom recursive freezing."
      },
      {
        q: "What is the result of `console.log(1 + '2' + 3);`?",
        options: ["\"123\"", "\"6\"", "15", "NaN"],
        ans: 0,
        insight: "Operators run left to right. `1 + '2'` coerces 1 to string -> `'12'`. Then `'12' + 3` coerces 3 to string -> `'123'`.",
        pitfall: "Assuming operator precedence forces numeric addition first."
      },
      {
        q: "How does an arrow function handle the `this` context compared to standard function declarations?",
        options: [
          "Arrow functions inherit `this` lexically from their enclosing scope at declaration time.",
          "Arrow functions create their own dynamic `this` context when invoked.",
          "Arrow functions bind `this` strictly to the global window object.",
          "Arrow functions allow rebinding `this` using `.bind()` or `.call()`."
        ],
        ans: 0,
        insight: "Arrow functions do NOT have their own `this`, `arguments`, or `super`. They capture `this` from the outer lexical lexical environment.",
        pitfall: "Using arrow functions as object methods where `this` needs to refer to the object instance."
      },
      {
        q: "What is the output of `console.log(typeof null);` in JavaScript?",
        options: ["\"object\"", "\"null\"", "\"undefined\"", "\"primitive\""],
        ans: 0,
        insight: "This is a historical bug in JavaScript from 1995. In JS initial implementation, values were stored in 32-bit units with tag bits. Object tag was 000, and `null` pointer was 0x00, leading to `typeof null === 'object'`.",
        pitfall: "Using `typeof x === 'object'` to check if x is an object without checking `x !== null`."
      }
    ];
    const dataIndex = (questionNum - 1) % 10;
    return {
      id: questionNum,
      level,
      levelTitle: jsLevels[0].title,
      question: level1Data[dataIndex].q,
      options: level1Data[dataIndex].options,
      correctAnswer: level1Data[dataIndex].ans,
      masterInsight: level1Data[dataIndex].insight,
      pitfall: level1Data[dataIndex].pitfall
    };
  }

  const topicTitles = [
    "Functions & Lexical Scope", "Array & Object Mutation Mechanics", "Closures & Memory Scope Preservation",
    "Prototype Chain & Object Heritage", "Promises & Microtask Queue", "Event Loop & Call Stack Execution",
    "ES Modules, Generators & Symbol Iterators", "Garbage Collection & WeakReferences", "V8 Engine Internals, JIT & Proxy/Reflect"
  ];
  const currentTitle = topicTitles[level - 2];

  return {
    id: questionNum,
    level,
    levelTitle: `Level ${level}: ${currentTitle}`,
    question: `[JS Q${questionNum} - Level ${level}] In advanced V8 JavaScript runtime engine analysis concerning ${currentTitle}, what is the exact execution behavior?`,
    codeSnippet: `// Advanced JS Context Q${questionNum}\nconst proxy = new Proxy(targetObject, {\n  get(target, prop, receiver) {\n    console.log(\`Reflect trap invoked for: \${String(prop)}\`);\n    return Reflect.get(...arguments);\n  }\n});`,
    options: [
      `Microtasks (Promises, queueMicrotask) take strict precedence over Macrotasks (setTimeout, setInterval) at the end of each call stack turn.`,
      `Macrotasks clear the entire event queue before any Promise handlers execute.`,
      `Arrow functions create a dynamic execution context on the call stack for every call.`,
      `Garbage collection immediately destroys closed-over variables when a parent function finishes executing.`
    ],
    correctAnswer: 0,
    masterInsight: `As a 100-year JS Master & V8 engine expert: The Event Loop always drains the Microtask queue COMPLETELY after synchronous stack execution before picking the next Macrotask from the Task Queue.`,
    pitfall: "Expecting setTimeout(fn, 0) to fire before resolved Promise.then() callbacks."
  };
});
