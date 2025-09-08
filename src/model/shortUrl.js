const mongoose = require('mongoose');


const shortUrlSchema = new mongoose.Schema({
    shortcode: { type: String, required: true, unique: true, index: true },
    originalUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiryAt: { type: Date, required: true },
    clicksCount: { type: Number, default: 0 }
});


module.exports = mongoose.model('ShortUrl', shortUrlSchema)