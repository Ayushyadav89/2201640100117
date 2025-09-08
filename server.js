require('dotenv').config();
const express = require('express');
const path = require('path');

const loggerMiddleware = require('./src/middleware/logger.js');
const { writeLog } = require('./src/middleware/logger.js');
const shorturlsRouter = require('./src/routes/shortUrl.js');
const redirectRouter = require('./src/routes/redirect.js');
const { connect } = require('./src/config/db.js');

const app = express();

app.use(express.json({ limit: '50kb' }));

app.use(loggerMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com;"
  );
  next();
});

app.use('/shorturls', shorturlsRouter); 
app.use('/', redirectRouter); 

app.use('/shorturls', (req, res) => {
  return res.status(404).json({ error: 'Not Found' });
});

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


app.get('/', (req, res) => {
  res.send('URL Shortener API is running');
});

const PORT = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(PORT, () => {
      writeLog({
        event: 'server_start',
        ts: new Date().toISOString(),
        message: `Server started on port ${PORT}`,
      });
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
