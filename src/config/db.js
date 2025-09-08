const mongoose = require('mongoose');
const { writeLog } = require('../middleware/logger.js');


async function connect(uri) {
  const MONGO_URI = uri || process.env.MONGO_URI;
  if (!MONGO_URI) {
    const errorMsg = 'MongoDB URI is not defined';
    writeLog({ event: 'db_error', ts: new Date().toISOString(), message: errorMsg });
    throw new Error(errorMsg);
  }

  try {
    await mongoose.connect(MONGO_URI, { dbName: 'url_shortener' });
    writeLog({ event: 'db_connect', ts: new Date().toISOString(), message: 'MongoDB connected' });
    console.log("Database Connected")
  } catch (err) {
    writeLog({ event: 'db_error', ts: new Date().toISOString(), message: err.message });
    throw err;
  }
}


module.exports = { connect };