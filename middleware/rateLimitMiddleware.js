const { checkLimit, LIMIT } = require('../rateLimiter');

module.exports = function rateLimitMiddleware(req, res, next) {
  const key = req.header('X-Api-Key') || 'anonymous';
  const result = checkLimit(key);

  res.set('X-RateLimit-Remaining', String(result.remaining));
  res.set('X-RateLimit-Limit', String(LIMIT));

  // BUG: re-derives the block decision from raw numbers instead of trusting
  // result.blocked, and copy-pastes the same off-by-one comparison.
  // Correct comparison is `result.count > result.limit`.
  if (result.count >= result.limit) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  next();
};
