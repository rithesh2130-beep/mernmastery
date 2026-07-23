/**
 * MERN Mastery Academy — Comprehensive API & Integration Test Suite
 * Run with: node test.js (from the server/ directory)
 */

import fetch from 'node-fetch';

const BASE = 'http://localhost:5000/api';
const TIMESTAMP = Date.now();
const TEST_EMAIL = `testuser_${TIMESTAMP}@example.com`;
const TEST_PASSWORD = 'TestPass@123';
const TEST_NAME = 'Test Scholar';

// ─── Helpers ────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
let warnings = 0;
const results = [];

function log(emoji, label, msg, detail = '') {
  const line = `${emoji}  ${label.padEnd(52)} ${msg}${detail ? '\n     ↳ ' + detail : ''}`;
  console.log(line);
  results.push({ emoji, label, msg, detail });
}

function assert(condition, label, passMsg, failMsg, detail = '') {
  if (condition) {
    passed++;
    log('✅', label, passMsg, detail);
  } else {
    failed++;
    log('❌', label, failMsg, detail);
  }
}

function warn(label, msg, detail = '') {
  warnings++;
  log('⚠️ ', label, msg, detail);
}

function section(title) {
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`  🔷 ${title}`);
  console.log('─'.repeat(70));
}

async function req(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE}${path}`, opts);
    let data;
    try { data = await res.json(); } catch { data = {}; }
    return { status: res.status, data, ok: res.ok };
  } catch (err) {
    return { status: 0, data: { message: err.message }, ok: false };
  }
}

// ─── State shared across tests ───────────────────────────────────────────────
let authToken = '';
let userId = '';

// ════════════════════════════════════════════════════════════════════════════
// 1. SERVER CONNECTIVITY
// ════════════════════════════════════════════════════════════════════════════
section('1. SERVER CONNECTIVITY');

try {
  const res = await fetch('http://localhost:5000/api/questions?domain=js&level=1');
  assert(res.ok, 'Backend server reachable', `HTTP ${res.status} OK`, `Backend not responding (status ${res.status})`);
} catch (err) {
  assert(false, 'Backend server reachable', '', `Cannot reach http://localhost:5000 — ${err.message}`);
}

// ════════════════════════════════════════════════════════════════════════════
// 2. AUTHENTICATION — REGISTRATION
// ════════════════════════════════════════════════════════════════════════════
section('2. AUTHENTICATION — REGISTRATION');

// 2a. Missing fields
{
  const r = await req('POST', '/auth/register', { email: TEST_EMAIL });
  assert(r.status === 400, 'Register: missing fields → 400', `Status 400`, `Status ${r.status}`, r.data.message);
}

// 2b. Weak password
{
  const r = await req('POST', '/auth/register', { name: TEST_NAME, email: TEST_EMAIL, password: '1234' });
  assert(r.status === 400, 'Register: weak password → 400', `Status 400`, `Status ${r.status}`, r.data.message);
}

// 2c. Valid registration
{
  const r = await req('POST', '/auth/register', { name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD });
  assert(r.status === 201, 'Register: valid credentials → 201', `Status 201`, `Status ${r.status}`, r.data.message);
  if (r.ok && r.data.token) {
    authToken = r.data.token;
    userId = r.data.user?.id;
    assert(typeof r.data.token === 'string' && r.data.token.length > 20, 'Register: JWT token returned', 'Token present', 'Token missing or malformed');
    assert(r.data.user?.email === TEST_EMAIL, 'Register: correct email in response', `email = ${TEST_EMAIL}`, `Got: ${r.data.user?.email}`);
    assert(r.data.user?.isVerified === false, 'Register: isVerified starts false', 'isVerified = false', `isVerified = ${r.data.user?.isVerified}`);
  }
}

// 2d. Duplicate email
{
  const r = await req('POST', '/auth/register', { name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD });
  assert(r.status === 400, 'Register: duplicate email → 400', `Status 400`, `Status ${r.status}`, r.data.message);
}

// ════════════════════════════════════════════════════════════════════════════
// 3. AUTHENTICATION — LOGIN
// ════════════════════════════════════════════════════════════════════════════
section('3. AUTHENTICATION — LOGIN');

// 3a. Wrong password
{
  const r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: 'WrongPass@999' });
  assert(r.status === 400, 'Login: wrong password → 400', `Status 400`, `Status ${r.status}`, r.data.message);
}

// 3b. Non-existent user
{
  const r = await req('POST', '/auth/login', { email: 'nobody@nowhere.com', password: TEST_PASSWORD });
  assert(r.status === 400, 'Login: unknown email → 400', `Status 400`, `Status ${r.status}`, r.data.message);
}

// 3c. Valid login
{
  const r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: TEST_PASSWORD });
  assert(r.status === 200, 'Login: valid credentials → 200', `Status 200`, `Status ${r.status}`, r.data.message);
  if (r.ok && r.data.token) {
    authToken = r.data.token; // refresh token for subsequent tests
    assert(r.data.user?.name === TEST_NAME, 'Login: correct name returned', `name = ${TEST_NAME}`, `Got: ${r.data.user?.name}`);
    assert(typeof r.data.user?.isVerified === 'boolean', 'Login: isVerified field present', 'isVerified field present', 'isVerified field missing');
  }
}

// 3d. Missing fields
{
  const r = await req('POST', '/auth/login', { email: TEST_EMAIL });
  assert(r.status === 400, 'Login: missing password → 400', `Status 400`, `Status ${r.status}`);
}

// ════════════════════════════════════════════════════════════════════════════
// 4. AUTH MIDDLEWARE & PROTECTED ROUTES
// ════════════════════════════════════════════════════════════════════════════
section('4. AUTH MIDDLEWARE & PROTECTED ROUTES');

// 4a. No token → 401
{
  const r = await req('GET', '/users/profile');
  assert(r.status === 401, 'Profile: no token → 401', `Status 401`, `Status ${r.status}`);
}

// 4b. Invalid token → 401
{
  const r = await req('GET', '/users/profile', null, 'totally.invalid.token');
  assert(r.status === 401, 'Profile: bad token → 401', `Status 401`, `Status ${r.status}`);
}

// 4c. Valid token → profile returned
{
  const r = await req('GET', '/users/profile', null, authToken);
  assert(r.status === 200, 'Profile: valid token → 200', `Status 200`, `Status ${r.status}`);
  assert(r.data.email === TEST_EMAIL, 'Profile: email matches', `email = ${TEST_EMAIL}`, `Got: ${r.data.email}`);
  assert(r.data.name === TEST_NAME, 'Profile: name matches', `name = ${TEST_NAME}`, `Got: ${r.data.name}`);
}

// ════════════════════════════════════════════════════════════════════════════
// 5. USER PROFILE — UPDATE
// ════════════════════════════════════════════════════════════════════════════
section('5. USER PROFILE — UPDATE');

// 5a. Update name and bio
{
  const r = await req('PUT', '/users/profile', { name: 'Updated Scholar', bio: 'A MERN enthusiast', affiliation: 'MERN Corp' }, authToken);
  assert(r.status === 200, 'Profile update: name/bio/affiliation → 200', `Status 200`, `Status ${r.status}`);
  assert(r.data.name === 'Updated Scholar', 'Profile update: name saved', 'name = Updated Scholar', `Got: ${r.data.name}`);
  assert(r.data.bio === 'A MERN enthusiast', 'Profile update: bio saved', 'bio saved', `Got: ${r.data.bio}`);
  assert(r.data.affiliation === 'MERN Corp', 'Profile update: affiliation saved', 'affiliation saved', `Got: ${r.data.affiliation}`);
}

// 5b. Update avatarColor
{
  const r = await req('PUT', '/users/profile', { avatarColor: '#FF5733' }, authToken);
  assert(r.status === 200, 'Profile update: avatarColor → 200', `Status 200`, `Status ${r.status}`);
  assert(r.data.avatarColor === '#FF5733', 'Profile update: avatarColor saved', 'avatarColor saved', `Got: ${r.data.avatarColor}`);
}

// 5c. Attempt duplicate email swap
{
  const r = await req('PUT', '/users/profile', { email: TEST_EMAIL }, authToken);
  assert(r.status === 200, 'Profile update: same email → 200 (no change)', `Status 200`, `Status ${r.status}`);
}

// 5d. Profile pic (base64-like string)
{
  const fakeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const r = await req('PUT', '/users/profile', { profilePic: fakeBase64 }, authToken);
  assert(r.status === 200, 'Profile update: profilePic upload → 200', `Status 200`, `Status ${r.status}`);
  assert(r.data.profilePic === fakeBase64, 'Profile update: profilePic persisted', 'profilePic saved', 'profilePic not saved');
}

// ════════════════════════════════════════════════════════════════════════════
// 6. PROGRESS SYNC
// ════════════════════════════════════════════════════════════════════════════
section('6. PROGRESS SYNC');

// 6a. No token
{
  const r = await req('POST', '/users/sync', { streak: 5 });
  assert(r.status === 401, 'Sync: no token → 401', `Status 401`, `Status ${r.status}`);
}

// 6b. Valid sync — bookmarks use domain-prefixed string IDs
{
  const r = await req('POST', '/users/sync', {
    streak: 7,
    progress: { js: { 1: { score: 9, total: 10, completed: true } } },
    bookmarks: ['js-1', 'html-5'],
    lastDailyChallenge: new Date().toDateString()
  }, authToken);
  assert(r.status === 200, 'Sync: valid payload → 200', `Status 200`, `Status ${r.status}`);
  assert(r.data.user?.streak === 7, 'Sync: streak persisted', 'streak = 7', `Got: ${r.data.user?.streak}`);
  assert(Array.isArray(r.data.user?.bookmarks), 'Sync: bookmarks array returned', 'bookmarks is array', 'bookmarks missing');
}

// 6c. Verify sync persisted via profile
{
  const r = await req('GET', '/users/profile', null, authToken);
  assert(r.status === 200 && r.data.streak === 7, 'Sync: streak persisted in DB', 'streak = 7 confirmed', `Got streak: ${r.data.streak}`);
  assert(Array.isArray(r.data.bookmarks) && r.data.bookmarks.includes('js-1'), 'Sync: bookmarks persisted in DB', 'bookmark [js-1] confirmed', `Bookmarks: ${JSON.stringify(r.data.bookmarks)}`);
}

// ════════════════════════════════════════════════════════════════════════════
// 7. QUESTIONS DATA API
// ════════════════════════════════════════════════════════════════════════════
section('7. QUESTIONS DATA API');

const domains = ['js', 'react', 'mongo', 'node', 'express', 'html', 'css'];

for (const domain of domains) {
  const r = await req('GET', `/questions?domain=${domain}&level=1`);
  assert(r.status === 200 && Array.isArray(r.data), `Questions: domain=${domain} level=1`, `${r.data.length ?? 0} questions returned`, `Failed — status ${r.status}`);
}

// Level filtering
{
  const r = await req('GET', `/questions?domain=js&level=2`);
  assert(r.status === 200, 'Questions: level=2 filter works', `${r.data.length ?? 0} questions`, `Status ${r.status}`);
}

// No filter (all questions)
{
  const r = await req('GET', `/questions`);
  assert(r.status === 200 && r.data.length >= 500, 'Questions: no filter → full DB (≥500)', `${r.data.length} total questions`, `Status ${r.status}, count ${r.data.length}`);
}

// ════════════════════════════════════════════════════════════════════════════
// 8. INTERVIEW BANK DATA API
// ════════════════════════════════════════════════════════════════════════════
section('8. INTERVIEW BANK DATA API');

for (const domain of domains) {
  const r = await req('GET', `/interviews?domain=${domain}`);
  assert(r.status === 200 && Array.isArray(r.data), `Interviews: domain=${domain}`, `${r.data.length ?? 0} items`, `Failed — status ${r.status}`);
}

// No filter
{
  const r = await req('GET', `/interviews`);
  assert(r.status === 200 && r.data.length >= 10, 'Interviews: no filter → all items (≥10)', `${r.data.length} total items`, `Status ${r.status}`);
}

// ════════════════════════════════════════════════════════════════════════════
// 12. PASSWORD STRENGTH VALIDATION
// ════════════════════════════════════════════════════════════════════════════
section('12. PASSWORD STRENGTH VALIDATION');

const weakPasswords = [
  ['no-uppercase', 'testpass@123'],
  ['no-lowercase', 'TESTPASS@123'],
  ['no-number',    'TestPass@abc'],
  ['no-special',   'TestPass1234'],
  ['too-short',    'Te@1'],
];

for (const [label, pwd] of weakPasswords) {
  const r = await req('POST', '/auth/register', {
    name: 'Weak Test',
    email: `weak_${label}_${TIMESTAMP}@test.com`,
    password: pwd
  });
  assert(r.status === 400, `Password: ${label} → rejected`, `Status 400`, `Status ${r.status} — weak password accepted!`, r.data.message?.substring(0, 60));
}

// Strong password accepted
{
  const strongEmail = `strong_${TIMESTAMP}@test.com`;
  const r = await req('POST', '/auth/register', { name: 'Strong User', email: strongEmail, password: 'Secure@Pass9' });
  assert(r.status === 201, 'Password: strong password → accepted', `Status 201`, `Status ${r.status}`, r.data.message);
}

// ════════════════════════════════════════════════════════════════════════════
// 9. RATE LIMITING (runs LAST to avoid polluting other auth tests)
// ════════════════════════════════════════════════════════════════════════════
section('9. RATE LIMITING (Auth Route Brute-Force Guard)');

// Check RateLimit headers are present on auth routes (proves middleware is active)
{
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'check@headers.com', password: 'Test@1234' })
  });

  // Standard rate limit headers from express-rate-limit
  const limitHeader = res.headers.get('ratelimit-limit') || res.headers.get('x-ratelimit-limit');
  const remainHeader = res.headers.get('ratelimit-remaining') || res.headers.get('x-ratelimit-remaining');

  assert(limitHeader !== null, 'Rate limit: RateLimit-Limit header present', `limit = ${limitHeader}`, 'RateLimit-Limit header missing — middleware not applied!');
  assert(remainHeader !== null, 'Rate limit: RateLimit-Remaining header present', `remaining = ${remainHeader}`, 'RateLimit-Remaining header missing');
  assert(parseInt(limitHeader) > 0, 'Rate limit: limit is a positive number', `limit = ${limitHeader}`, `limit value invalid: ${limitHeader}`);

  // Verify limit is 200 in dev or 20 in prod
  const expectedMax = process.env.NODE_ENV === 'production' ? 20 : 200;
  assert(parseInt(limitHeader) === expectedMax, `Rate limit: max = ${expectedMax} for ${process.env.NODE_ENV || 'development'}`, `limit = ${limitHeader} ✓`, `Expected ${expectedMax}, got ${limitHeader}`);
}

// ════════════════════════════════════════════════════════════════════════════
// RESULTS SUMMARY
// ════════════════════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(70)}`);
console.log(`  📊  TEST RESULTS SUMMARY`);
console.log(`${'═'.repeat(70)}`);
console.log(`  ✅  Passed  : ${passed}`);
console.log(`  ❌  Failed  : ${failed}`);
console.log(`  ⚠️   Warnings: ${warnings}`);
console.log(`  📝  Total   : ${passed + failed + warnings}`);
console.log(`${'═'.repeat(70)}`);

if (failed === 0) {
  console.log(`\n  🎉  ALL TESTS PASSED! Application is working correctly.\n`);
} else {
  console.log(`\n  ⚠️   ${failed} test(s) failed. Review the output above.\n`);
  process.exit(1);
}
