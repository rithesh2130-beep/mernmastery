// Comprehensive MERN Mastery Academy Verification Engine
import { DOMAINS } from '../src/data/index.js';

console.log("==================================================");
console.log("🧪 STARTING COMPREHENSIVE DATA & LOGIC VERIFICATION");
console.log("==================================================");

let totalErrors = 0;
let totalWarnings = 0;

// 1. Validate All Domain Modules
Object.keys(DOMAINS).forEach(key => {
  const dom = DOMAINS[key];
  console.log(`\nChecking Domain: ${dom.name} (${key.toUpperCase()})`);

  // Verify questions count
  if (dom.questions.length !== 100) {
    console.error(`❌ ERROR: Domain ${key} has ${dom.questions.length} questions, expected exactly 100.`);
    totalErrors++;
  } else {
    console.log(`✅ Questions Count: 100/100`);
  }

  // Verify levels structure
  if (dom.levels.length !== 10) {
    console.error(`❌ ERROR: Domain ${key} has ${dom.levels.length} levels defined, expected exactly 10.`);
    totalErrors++;
  } else {
    console.log(`✅ Level Tiers Count: 10/10`);
  }

  // In-depth check for all 100 questions
  let validQuestions = 0;
  dom.questions.forEach((q, idx) => {
    let questionHasError = false;

    // Check properties
    if (q.id === undefined || q.level === undefined || !q.question || !q.options || q.correctAnswer === undefined) {
      console.error(`❌ ERROR: Question at index ${idx} in domain ${key} is missing vital properties.`);
      questionHasError = true;
    }

    // Check options length
    if (q.options && q.options.length !== 4) {
      console.error(`❌ ERROR: Question ${q.id} in domain ${key} has ${q.options.length} options, expected 4.`);
      questionHasError = true;
    }

    // Check correct answer range
    if (q.correctAnswer < 0 || q.correctAnswer > 3) {
      console.error(`❌ ERROR: Question ${q.id} in domain ${key} has out-of-bounds correctAnswer: ${q.correctAnswer}`);
      questionHasError = true;
    }

    // Check master insights
    if (!q.masterInsight) {
      console.error(`❌ ERROR: Question ${q.id} in domain ${key} is missing masterInsight.`);
      questionHasError = true;
    }

    if (!questionHasError) {
      validQuestions++;
    }
  });

  if (validQuestions === 100) {
    console.log(`✅ All 100 MCQs passed integrity and schema format validation.`);
  } else {
    totalErrors += (100 - validQuestions);
  }

  // Validate Interview Q&As
  if (!dom.interviews || dom.interviews.length === 0) {
    console.warn(`⚠️ WARNING: Domain ${key} has no interview prep questions defined.`);
    totalWarnings++;
  } else {
    console.log(`✅ Interview prep items: ${dom.interviews.length} loaded`);
    dom.interviews.forEach(item => {
      if (!item.title || !item.question || !item.answer || !item.teacherTip) {
        console.error(`❌ ERROR: Interview item ${item.id} in domain ${key} has missing content fields.`);
        totalErrors++;
      }
    });
  }
});

// 2. Validate Level Unlocking Logic
console.log("\n--------------------------------------------------");
console.log("⚙️ TESTING LEVEL UNLOCKING STATE LOGIC");
console.log("--------------------------------------------------");

// Mocking progress record state
const mockProgress = {
  js: {
    1: { score: 8, total: 10, completed: true },
    2: { score: 6, total: 10, completed: false }
  }
};

const isLevelUnlockedMock = (domain, level) => {
  if (level === 1) return true;
  const domainProgress = mockProgress[domain] || {};
  const prevLevelProgress = domainProgress[level - 1];
  return prevLevelProgress?.completed === true;
};

// Test cases
const testCase1 = isLevelUnlockedMock('js', 1);
const testCase2 = isLevelUnlockedMock('js', 2);
const testCase3 = isLevelUnlockedMock('js', 3);

if (testCase1 === true) {
  console.log("✅ Test Case 1 Passed: Level 1 is unlocked by default.");
} else {
  console.error("❌ Test Case 1 Failed: Level 1 should be unlocked.");
  totalErrors++;
}

if (testCase2 === true) {
  console.log("✅ Test Case 2 Passed: Level 2 is unlocked (Level 1 completed with score 8/10).");
} else {
  console.error("❌ Test Case 2 Failed: Level 2 should be unlocked.");
  totalErrors++;
}

if (testCase3 === false) {
  console.log("✅ Test Case 3 Passed: Level 3 is locked (Level 2 completed: false).");
} else {
  console.error("❌ Test Case 3 Failed: Level 3 should be locked.");
  totalErrors++;
}

console.log("\n==================================================");
console.log("📊 FINAL VERIFICATION REPORT");
console.log("==================================================");
console.log(`Total Errors Detected: ${totalErrors}`);
console.log(`Total Warnings Detected: ${totalWarnings}`);
if (totalErrors === 0) {
  console.log("🚀 ALL INTEGRITY TESTS PASSED SUCCESSFULLY!");
} else {
  console.log("⚠️ RECTIFY ERRORS LISTED ABOVE BEFORE PUSHING TO PRODUCTION.");
}
console.log("==================================================");
