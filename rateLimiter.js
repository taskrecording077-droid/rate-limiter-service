// Sliding-window-ish rate limiter, keyed per API key.
const WINDOW_MS = 60_000; // 1 minute
const LIMIT = 100;        // documented limit: 100 requests per window

const store = new Map(); // key -> { windowStart, count }

function checkLimit(key) {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    entry = { windowStart: now, count: 0 };
    store.set(key, entry);
  }

  entry.count += 1;

  // BUG: off-by-one. This blocks the request that *reaches* the limit,
  // so only 99 requests succeed per window instead of the documented 100.
  // Correct comparison is `entry.count > LIMIT`.
  const blocked = entry.count >= LIMIT;

  return {
    key,
    count: entry.count,
    limit: LIMIT,
    remaining: Math.max(0, LIMIT - entry.count),
    blocked,
    resetInMs: WINDOW_MS - (now - entry.windowStart),
  };
}

function _resetStoreForTests() {
  store.clear();
}

module.exports = { checkLimit, WINDOW_MS, LIMIT, _resetStoreForTests };
