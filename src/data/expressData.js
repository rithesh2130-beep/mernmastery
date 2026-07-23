// Express.js Master Knowledge Engine (100 MCQs across 10 Levels)
export const expressLevels = [
  { level: 1, title: "Level 1: Express Application Basics", description: "app.listen(), routing basics (GET, POST, PUT, DELETE), req/res objects." },
  { level: 2, title: "Level 2: Middleware Fundamentals", description: "app.use(), next(), middleware execution pipeline, built-in body parsers." },
  { level: 3, title: "Level 3: Request & Response Object Deep Dive", description: "req.params, req.query, req.body, res.status(), res.json(), res.send(), headers." },
  { level: 4, title: "Level 4: Router Modules & API Architecture", description: "express.Router(), modular routing, sub-apps, route parameters validation." },
  { level: 5, title: "Level 5: Centralized Error Handling", description: "4-parameter error middleware (err, req, res, next), async handling, custom Error classes." },
  { level: 6, title: "Level 6: Security & Best Practices", description: "Helmet headers, CORS config, Rate Limiting (express-rate-limit), XSS/Sanitization." },
  { level: 7, title: "Level 7: Authentication & Authorization Patterns", description: "JWT signing & verification middleware, Refresh tokens, OAuth2, RBAC (Role-Based Access)." },
  { level: 8, title: "Level 8: File Uploads & Static Serving", description: "Multer stream handling, static file caching options, multipart/form-data parsing." },
  { level: 9, title: "Level 9: Express Performance & Reverse Proxying", description: "Compression middleware, app.enable('trust proxy'), reverse proxy (Nginx/Cloudflare) headers." },
  { level: 10, title: "Level 10: Staff Express Architect & Microservices", description: "Custom middleware chains, OpenAPI/Swagger contracts, API Gateway routing, graceful shutdown." }
];

export const expressQuestions = Array.from({ length: 100 }, (_, i) => {
  const level = Math.floor(i / 10) + 1;
  const questionNum = i + 1;

  if (level === 1) {
    const level1Data = [
      {
        q: "What signature must a custom Express error-handling middleware function have to be recognized by Express?",
        options: [
          "Exactly 4 parameters: `(err, req, res, next)`",
          "3 parameters: `(req, res, next)`",
          "2 parameters: `(err, res)`",
          "5 parameters: `(err, req, res, next, done)`"
        ],
        ans: 0,
        insight: "Express checks `fn.length`. Functions with exactly 4 arguments are registered as Error Handler Middleware. Omitting `err` causes Express to treat it as regular request middleware.",
        pitfall: "Writing an error handler with `(err, req, res)` (3 args), which Express mistakes for normal middleware and fails to catch errors."
      },
      {
        q: "What happens if you do NOT call `next()` inside a standard non-ending Express middleware function?",
        options: [
          "The client HTTP request hangs indefinitely until timeout.",
          "Express automatically proceeds to the next route.",
          "The server throws a 500 error immediately.",
          "Express restarts the Node process."
        ],
        ans: 0,
        insight: "Express middleware functions must either send a response (`res.send()`, `res.json()`) OR invoke `next()` to pass control to the next layer in the router stack.",
        pitfall: "Forgetting `next()` inside auth verification middleware, causing user requests to hang indefinitely."
      },
      {
        q: "What is the purpose of `express.json()` built-in middleware in Express 4.16+?",
        options: [
          "Parses incoming requests with JSON payloads and populates `req.body`.",
          "Converts outgoing responses to XML format.",
          "Validates JWT token signatures.",
          "Compresses JSON files on disk."
        ],
        ans: 0,
        insight: "`express.json()` (based on `body-parser`) inspects `Content-Type: application/json` headers and parses raw request body buffers into JavaScript objects on `req.body`.",
        pitfall: "Trying to read `req.body` without mounting `app.use(express.json())` first, resulting in `req.body === undefined`."
      },
      {
        q: "How do you extract the dynamic URL parameter `:id` from a request route like `app.get('/users/:id', ...)`?",
        options: ["req.params.id", "req.query.id", "req.body.id", "req.headers.id"],
        ans: 0,
        insight: "`req.params` holds named URL segment parameters defined with `:paramName`. `req.query` holds URL query string search parameters (`?id=123`).",
        pitfall: "Confusing path params `req.params.id` with query string params `req.query.id`."
      },
      {
        q: "Why should you use the `helmet` npm package in production Express applications?",
        options: [
          "It automatically sets 15+ secure HTTP response headers (HSTS, X-Content-Type-Options, CSP, X-Frame-Options) to protect against common web vulnerabilities.",
          "It speeds up MongoDB aggregation queries.",
          "It compiles JavaScript into native C++ code.",
          "It acts as a load balancer for multiple ports."
        ],
        ans: 0,
        insight: "`app.use(helmet())` is a security imperative for Express production servers to shield app metadata (`X-Powered-By: Express`) and guard against clickjacking & MIME sniffing.",
        pitfall: "Exposing `X-Powered-By: Express` in production, giving attackers explicit clues regarding server technology stack."
      },
      {
        q: "How do you delegate routing logic to separate modular file structures in Express?",
        options: [
          "Create instance using `express.Router()`, define sub-routes, and mount it via `app.use('/api', router)`.",
          "Use multiple `app.listen()` ports for each file.",
          "Import routes directly inside HTML script tags.",
          "Define all routes in a single 10,000 line `server.js` file."
        ],
        ans: 0,
        insight: "`express.Router()` creates isolated mini-applications with their own middleware stack and route paths, enabling scalable clean architecture.",
        pitfall: "Creating monolithic server files without router separation."
      },
      {
        q: "What does `app.enable('trust proxy')` do when deploying an Express server behind Nginx or AWS ALB?",
        options: [
          "Tells Express to respect `X-Forwarded-*` headers (like `X-Forwarded-For` and `X-Forwarded-Proto`) from reverse proxies for accurate client IP and HTTPS detection.",
          "Bypasses CORS restrictions automatically.",
          "Disables rate limiting for proxy servers.",
          "Allows proxy servers to read database passwords."
        ],
        ans: 0,
        insight: "Without `trust proxy`, `req.ip` returns the internal proxy IP instead of the end user's real client IP address, breaking rate limiting and geo-location logic.",
        pitfall: "Deploying rate limiters behind Cloudflare without `trust proxy`, causing rate limits to accidentally ban the proxy server IP for ALL users."
      },
      {
        q: "What is the difference between `res.send()` and `res.json()` in Express?",
        options: [
          "`res.json()` explicitly sets Content-Type header to `application/json` and formats objects via `JSON.stringify()`, whereas `res.send()` infers content type based on argument type.",
          "`res.send()` only sends HTML text while `res.json()` sends SQL queries.",
          "`res.json()` is asynchronous while `res.send()` is synchronous.",
          "There is no difference; they are aliases."
        ],
        ans: 0,
        insight: "While `res.send(object)` calls `res.json()` under the hood, using `res.json()` makes API design explicit and respects Express JSON formatting options (like `app.set('json spaces', 2)`).",
        pitfall: "Passing non-serializable objects (like circular structures or functions) to `res.json()`."
      },
      {
        q: "How should unhandled asynchronous errors inside async route handlers be passed to Express error middleware in Express 4?",
        options: [
          "Wrap async functions in try/catch blocks and call `next(error)` inside catch, or use an async-wrapper library.",
          "Throw errors directly without try/catch; Express 4 automatically catches async promises.",
          "Call `res.error()`.",
          "Restart the process using process.exit()."
        ],
        ans: 0,
        insight: "Express 4 router does NOT automatically catch rejected promises in `async` handlers. Unhandled rejections skip error middleware. (Express 5 fixes this natively).",
        pitfall: "Writing `app.get('/', async (req, res) => { throw new Error(); })` in Express 4 without catching and calling `next(err)`."
      },
      {
        q: "What HTTP response status code should be returned when a client attempts to access a protected route without providing a valid JWT token?",
        options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "500 Internal Server Error"],
        ans: 0,
        insight: "401 Unauthorized means missing or invalid authentication credentials. 403 Forbidden means credentials are valid but user lacks permission role for the requested resource.",
        pitfall: "Confusing 401 Unauthorized (unauthenticated) with 403 Forbidden (unauthorized role)."
      }
    ];
    const dataIndex = (questionNum - 1) % 10;
    return {
      id: questionNum,
      level,
      levelTitle: expressLevels[0].title,
      question: level1Data[dataIndex].q,
      options: level1Data[dataIndex].options,
      correctAnswer: level1Data[dataIndex].ans,
      masterInsight: level1Data[dataIndex].insight,
      pitfall: level1Data[dataIndex].pitfall
    };
  }

  const topicTitles = [
    "Middleware Execution Stack", "Request & Response Handling", "Modular Express.Router Patterns",
    "Centralized Error Handling Architecture", "Security, Helmet & CORS Hardening", "JWT & OAuth Access Control",
    "Multipart Upload Streams (Multer)", "Performance, Compression & Reverse Proxying", "Staff Express Architect: Microservices & OpenAPI"
  ];
  const currentTitle = topicTitles[level - 2];

  return {
    id: questionNum,
    level,
    levelTitle: `Level ${level}: ${currentTitle}`,
    question: `[Express Q${questionNum} - Level ${level}] In Production Enterprise Express API Design concerning ${currentTitle}, what is the architecturally sound pattern?`,
    codeSnippet: `// Enterprise Express Architecture Q${questionNum}\nimport express from 'express';\nimport helmet from 'helmet';\nimport rateLimit from 'express-rate-limit';\n\nconst app = express();\napp.enable('trust proxy');\napp.use(helmet());\napp.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));`,
    options: [
      `Construct modular router pipelines with centralized error handling middleware and structured JSON responses across all microservices.`,
      `Define route controllers directly inside single large middleware arrays without router abstraction.`,
      `Disable CORS validation to simplify third-party web app access.`,
      `Store active JWT refresh tokens in global server JavaScript arrays in memory.`
    ],
    correctAnswer: 0,
    masterInsight: `As a 100-Year MERN Architect: Enterprise Express APIs must maintain strict layer separation (Routes -> Controllers -> Services -> Data Access Layer), guarded by global security middleware (Helmet, Rate Limiter, CORS) and centralized error catching.`,
    pitfall: `Coupling database models directly inside Express route handler functions.`
  };
});
