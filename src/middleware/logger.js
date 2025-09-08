const fs = require('fs');
const path = require('path');

const LOG_FILE = process.env.LOG_FILE || path.join(process.cwd(), 'logs', 'app.log');

// Ensure log folder exists
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

/**
 * Write a log entry as a JSON line.
 */
function writeLog(obj) {
  try {
    const line = JSON.stringify(obj) + '\n'; // ensure newline
    fs.appendFile(LOG_FILE, line, (err) => {
      if (err) {
        // Optional: print to stderr if logging fails
        console.error('Failed to write log:', err.message);
      }
    });
  } catch (e) {
    console.error('Logging error:', e.message);
  }
}

/**
 * Express middleware to log request/response lifecycle.
 */
function loggingMiddleware(req, res, next) {
  const start = Date.now();

  const entry = {
    event: 'request_start',
    ts: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    headers: {
      host: req.headers.host,
      referer: req.headers.referer || req.headers.referrer || null,
      ua: req.headers['user-agent'] || null,
    },
    bodyKeys: req.body && typeof req.body === 'object' ? Object.keys(req.body) : null,
  };

  writeLog(entry);

  res.on('finish', () => {
    const out = {
      event: 'request_end',
      ts: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
    };
    writeLog(out);
  });

  next();
}

module.exports = loggingMiddleware;
module.exports.writeLog = writeLog;
