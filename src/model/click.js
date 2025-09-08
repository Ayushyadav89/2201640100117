const mongoose = require('mongoose');


const clickSchema = new mongoose.Schema({
    shortcode: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now },
    referrer: String,
    ip: String,
    geo: String
});


module.exports = mongoose.model('Click', clickSchema);