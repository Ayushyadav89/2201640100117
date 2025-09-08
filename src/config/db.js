const mongoose = require('mongoose');
const { writeLog } = require('../middleware/logger');


async function connect(uri) {
const MONGO_URI = uri || process.env.MONGO_URI;
try {
await mongoose.connect(MONGO_URI, { dbName: 'url_shortener' });
writeLog({ event: 'db_connect', ts: new Date().toISOString(), message: 'MongoDB connected' });
} catch (err) {
writeLog({ event: 'db_error', ts: new Date().toISOString(), message: err.message });
throw err;
}
}


module.exports = { connect };