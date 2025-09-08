require('dotenv').config();
const express = require('express');

const loggerMiddleware = require('./src/middleware/logger');
const { writeLog } = require('./src/middleware/logger');
const shorturlsRouter = require('./src/routes/shortUrl');
const redirectRouter = require('./src/routes/redirect');

const app = express();

// Middleware to parse JSON
app.use(express.json({ limit: '50kb' }));

// Mandatory logging middleware
app.use(loggerMiddleware);

// API routes
app.use('/shorturls', shorturlsRouter);

// Redirect route for short codes (must come after API routes)
app.use('/', redirectRouter);

// 404 handler (only for API routes like /shorturls/*)
app.use('/shorturls', (req, res) => {
  return res.status(404).json({ error: 'Not Found' });
});

// Generic error handler
app.use((err, req, res, next) => {
  writeLog({
    event: 'error',
    ts: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
  });

  if (res.headersSent) return next(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
