const express = require('express');
const rateLimitMiddleware = require('./middleware/rateLimitMiddleware');
const { checkLimit, LIMIT } = require('./rateLimiter');

const app = express();
const PORT = process.env.PORT || 2001;

app.get('/api/bulk-fetch', rateLimitMiddleware, (req, res) => {
  res.json({
    data: ['item-1', 'item-2', 'item-3'],
    fetchedAt: new Date().toISOString(),
  });
});

// Status/reporting endpoint — does not enforce, just reports current counters.
app.get('/api/rate-limit-status', (req, res) => {
  const key = req.header('X-Api-Key') || 'anonymous';
  const status = checkLimit(key);
  res.json(status);
});

app.listen(PORT, () => {
  console.log(`Rate limiter demo API listening on http://localhost:${PORT}`);
  console.log(`Documented limit: ${LIMIT} requests / 60s window per X-Api-Key`);
});
