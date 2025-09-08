require('dotenv').config();
const express = require('express');
const path = require('path');

const loggerMiddleware = require('./src/middleware/logger');
const { writeLog } = require('./src/middleware/logger');
const shorturlsRouter = require('./src/routes/shortUrl');
const redirectRouter = require('./src/routes/redirect');

const app = express();

// JSON body parser
app.use(express.json({ limit: '50kb' }));

// Logging middleware (mandatory)
app.use(loggerMiddleware);

// Routes
app.use('/shorturls', shorturlsRouter); // API routes
app.use('/', redirectRouter); // Redirect route for short codes

// 404 handler (only for /shorturls API routes)
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
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
