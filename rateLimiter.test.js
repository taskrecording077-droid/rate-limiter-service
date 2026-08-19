// Existing smoke-test suite. Deliberately does NOT pin the exact boundary
// request number — that's why it stays green before *and* after the fix,
// matching the "existing tests still pass" step in the task script.
const assert = require('assert');
const { checkLimit, LIMIT, _resetStoreForTests } = require('./rateLimiter');

_resetStoreForTests();
const key = `smoke-test-${Date.now()}`;

const first = checkLimit(key);
assert.strictEqual(first.blocked, false, 'First request should not be blocked');
// assert.strictEqual(first.remaining, LIMIT - 1);

const second = checkLimit(key);
assert.ok(second.remaining < first.remaining, 'Remaining count should decrease');

let blocked = false;
for (let i = 0; i < LIMIT + 10; i++) {
  if (checkLimit(key).blocked) { blocked = true; break; }
}
assert.ok(blocked, 'Key should eventually be rate limited');

console.log('PASS: rate limiter smoke tests (does not pin exact boundary).');
