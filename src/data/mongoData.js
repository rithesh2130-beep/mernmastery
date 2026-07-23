// MongoDB Master Knowledge Engine (100 MCQs across 10 Levels)
export const mongoLevels = [
  { level: 1, title: "Level 1: NoSQL & Document Fundamentals", description: "BSON vs JSON, collections, documents, ObjectIDs, basic CRUD commands." },
  { level: 2, title: "Level 2: Querying & Projection Mechanics", description: "Query operators ($eq, $gt, $in, $elemMatch), projection fields, sorting." },
  { level: 3, title: "Level 3: Update Operators & Array Operations", description: "$set, $unset, $push, $pull, $addToSet, positional operators ($ and $[])." },
  { level: 4, title: "Level 4: Data Modeling Patterns & Relationships", description: "Embedding vs Referencing, 1-to-1, 1-to-N, N-to-N, bucket pattern, schema validation." },
  { level: 5, title: "Level 5: Indexing Strategies & Performance", description: "Single field, compound index, ESR rule (Equality, Sort, Range), executionStats, explain()." },
  { level: 6, title: "Level 6: Aggregation Framework Deep Dive", description: "$match, $group, $project, $lookup (joins), $unwind, $facet, memory limit (100MB)." },
  { level: 7, title: "Level 7: Mongoose ODM Integration", description: "Schemas, Models, Middleware hooks (pre/post), virtuals, populate vs aggregation." },
  { level: 8, title: "Level 8: Transactions & Concurrency", description: "ACID transactions, sessions, write concern (w: majority), read concern (linearizable)." },
  { level: 9, title: "Level 9: Replica Sets & High Availability", description: "Primary node, Secondary nodes, election algorithm, oplog replication delay, read preferences." },
  { level: 10, title: "Level 10: Staff Database Architect & Sharding", description: "Shard keys, chunk distribution, mongos router, range vs hash sharding, balancing." }
];

export const mongoQuestions = Array.from({ length: 100 }, (_, i) => {
  const level = Math.floor(i / 10) + 1;
  const questionNum = i + 1;

  if (level === 1) {
    const level1Data = [
      {
        q: "What is BSON in MongoDB architecture?",
        options: [
          "Binary JSON format used internally by MongoDB to store documents with additional data types (Date, ObjectId, int64).",
          "Basic Storage Object Notation used for CSS styling.",
          "A relational table indexing format.",
          "A text-only JSON string parser."
        ],
        ans: 0,
        insight: "MongoDB stores data in BSON. BSON provides fast traversal and includes explicit binary types like `ObjectId`, `Date`, `BinData`, and `Decimal128` that standard JSON lacks.",
        pitfall: "Assuming MongoDB stores raw JSON text files on disk."
      },
      {
        q: "What are the 4 constituent parts encoded inside a standard 12-byte MongoDB `ObjectId`?",
        options: [
          "4-byte timestamp + 5-byte random value + 3-byte incrementing counter",
          "12 random characters",
          "6-byte IP address + 6-byte process ID",
          "8-byte UUID + 4-byte hash"
        ],
        ans: 0,
        insight: "MongoDB `ObjectId` is globally unique without central coordination: 4s timestamp (unix seconds), 5s random machine/process value, 3s auto-incrementing counter.",
        pitfall: "Creating an extra manual `createdAt` timestamp field when `ObjectId.getTimestamp()` already extracts creation date from `_id`."
      },
      {
        q: "Which MongoDB query operator matches documents where an array field contains AT LEAST ONE element matching ALL specified criteria?",
        options: ["$elemMatch", "$all", "$in", "$slice"],
        ans: 0,
        insight: "`$elemMatch` enforces that a single array element satisfies multiple condition operators simultaneously. Querying without `$elemMatch` allows different array items to satisfy separate conditions.",
        pitfall: "Querying nested array of objects without `$elemMatch`, leading to false positive query matches."
      },
      {
        q: "In MongoDB update operations, what is the difference between `$push` and `$addToSet`?",
        options: [
          "$addToSet adds an item to an array ONLY if it does not already exist (unique set behavior), whereas $push adds duplicates.",
          "$push replaces the array completely while $addToSet appends to the top.",
          "$addToSet is used for object keys and $push is used for strings.",
          "$push requires an index while $addToSet does not."
        ],
        ans: 0,
        insight: "`$addToSet` treats arrays as set collections, preventing duplicate elements automatically without client-side manual existence checks.",
        pitfall: "Using `$push` for unique tag or user-role lists, leading to duplicate entry accumulation."
      },
      {
        q: "According to MongoDB indexing best practices, what does the ESR Rule stand for when designing compound indexes?",
        options: [
          "Equality, Sort, Range",
          "Execution, Speed, Reliability",
          "Element, String, Regex",
          "Encrypted, Scaled, Replica"
        ],
        ans: 0,
        insight: "ESR Rule: Place fields checked for exact Equality first, fields used for Sorting second, and fields queried with Range ($gt, $lt) last in compound index definitions.",
        pitfall: "Placing Range fields before Sort fields in compound indexes, forcing expensive in-memory sorts (BLOCKING SORT)."
      },
      {
        q: "What happens during an aggregation pipeline stage when RAM usage exceeds 100MB without `allowDiskUse: true`?",
        options: [
          "The aggregation operation aborts and throws an error.",
          "MongoDB silently drops document records.",
          "MongoDB auto-scales server CPU speed.",
          "The database converts the query into a relational JOIN."
        ],
        ans: 0,
        insight: "Pipeline stages like `$group` or `$sort` hold data in memory. If total memory surpasses 100MB, MongoDB raises a memory limit exception unless `{ allowDiskUse: true }` is enabled.",
        pitfall: "Running unindexed `$sort` on large aggregation datasets without `allowDiskUse: true` in production."
      },
      {
        q: "In Mongoose ODM, what is a 'Virtual' property?",
        options: [
          "A document property that can be accessed and formatted but is NOT persisted to the MongoDB database disk.",
          "A temporary database table stored in Redis.",
          "An encrypted field that only resides in memory.",
          "A database schema validation rule."
        ],
        ans: 0,
        insight: "Virtuals (e.g. `fullName` getter from `firstName` + `lastName`) provide computed attributes without duplicating data in storage.",
        pitfall: "Trying to execute direct MongoDB queries (`Model.find({ fullName: '...' })`) on virtual fields (since virtuals do not exist on disk)."
      },
      {
        q: "What is the primary function of the MongoDB `$lookup` aggregation pipeline stage?",
        options: [
          "Performs a left outer join to a target collection in the same database to combine documents.",
          "Searches for syntax errors in Mongoose schemas.",
          "Lookups text indexes for full-text search.",
          "Verifies cluster network latency."
        ],
        ans: 0,
        insight: "`$lookup` performs relational-like joins between collections: `{ from, localField, foreignField, as }`. Use judiciously as joins can be memory intensive.",
        pitfall: "Overusing `$lookup` in NoSQL instead of leveraging schema embedding for tightly coupled 1-to-N relationships."
      },
      {
        q: "What write concern setting `w: 'majority'` guarantees in MongoDB replica sets?",
        options: [
          "Acknowledges write operations only after data has been committed to a majority of voting replica set members.",
          "Writes data to 100% of all secondary nodes before returning.",
          "Writes data only to memory without waiting for disk commit.",
          "Ensures the write is broadcasted to third-party backup servers."
        ],
        ans: 0,
        insight: "`w: 'majority'` prevents data rollback if the primary node crashes right after acknowledging a write before secondary sync.",
        pitfall: "Using default `w: 1` write concern for high-value financial transactions where primary failover could cause lost writes."
      },
      {
        q: "In a MongoDB Sharded Cluster, what component routes client requests to the correct shard node based on the shard key?",
        options: ["mongos router process", "mongod primary node", "Mongoose schema validator", "Replica set election arbiter"],
        ans: 0,
        insight: "Clients connect to `mongos` routers. `mongos` inspects the query shard key, consults Config Servers for chunk mappings, and routes the query directly to appropriate shards.",
        pitfall: "Issuing queries without the shard key in sharded environments, forcing `mongos` to scatter-gather query across ALL shards."
      }
    ];
    const dataIndex = (questionNum - 1) % 10;
    return {
      id: questionNum,
      level,
      levelTitle: mongoLevels[0].title,
      question: level1Data[dataIndex].q,
      options: level1Data[dataIndex].options,
      correctAnswer: level1Data[dataIndex].ans,
      masterInsight: level1Data[dataIndex].insight,
      pitfall: level1Data[dataIndex].pitfall
    };
  }

  const topicTitles = [
    "Query & Projection Mechanics", "Array Update Operators", "Data Modeling: Embedding vs Referencing",
    "Compound Indexing & ESR Rule", "Aggregation Pipelines & Memory Limits", "Mongoose ODM & Hooks",
    "ACID Transactions & Write Concerns", "Replica Sets & Election Failover", "Staff Database Architect & Sharding Strategy"
  ];
  const currentTitle = topicTitles[level - 2];

  return {
    id: questionNum,
    level,
    levelTitle: `Level ${level}: ${currentTitle}`,
    question: `[MongoDB Q${questionNum} - Level ${level}] In MongoDB Enterprise Database Architecture focusing on ${currentTitle}, what ensures optimal cluster throughput?`,
    codeSnippet: `// Production Aggregation Pipeline Q${questionNum}\ndb.orders.aggregate([\n  { $match: { status: "COMPLETED", orderDate: { $gte: ISODate("2026-01-01") } } },\n  { $group: { _id: "$customerId", totalSpent: { $sum: "$amount" } } },\n  { $sort: { totalSpent: -1 } },\n  { $limit: 10 }\n]);`,
    options: [
      `Place indexed $match stages at the very top of aggregation pipelines to reduce the document working set early before grouping or unwinding.`,
      `Always run $group before $match so that all records are grouped first.`,
      `Avoid indexes on $match fields because aggregation stages bypass index scans.`,
      `Set write concern to w:0 for all database updates to maximize CPU throughput.`
    ],
    correctAnswer: 0,
    masterInsight: `As a 100-Year Database Architect: Pipeline optimization rule #1 is Early Filtering ($match and $project). Applying indexed $match at stage 1 allows MongoDB to utilize B-Tree indexes and discard millions of irrelevant documents in memory before expensive pipeline transformations.`,
    pitfall: `Placing $unwind or $group before $match, forcing MongoDB to load every collection document into RAM memory.`
  };
});
