const ShortUrl = require('../models/ShortUrl');
const Click = require('../models/Click');
const { generateUniqueShortcode } = require('../utils/generateShortcode');
const { isShortcodeValid } = require('../utils/validators');
const { writeLog } = require('../middleware/logger');

// Create Short URL
async function createShortUrl(req, res) {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: '"url" is required and must be a string' });
    }

    let minutes = 30; // default
    if (validity !== undefined) {
      if (!Number.isInteger(validity) || validity <= 0) {
        return res.status(400).json({ error: '"validity" must be a positive integer (minutes)' });
      }
      minutes = validity;
    }

    let code = null;
    if (shortcode) {
      if (!isShortcodeValid(shortcode)) {
        return res.status(400).json({
          error: 'Provided shortcode invalid. Must be 4-32 alphanumeric/_/- characters.',
        });
      }
      const exists = await ShortUrl.findOne({ shortcode }).lean();
      if (exists) {
        return res.status(409).json({ error: 'Provided shortcode already in use' });
      }
      code = shortcode;
    } else {
      code = await generateUniqueShortcode();
    }

    const expiryAt = new Date(Date.now() + minutes * 60 * 1000);
    const doc = new ShortUrl({ shortcode: code, originalUrl: url, expiryAt });
    await doc.save();

    const host = process.env.HOSTNAME || `localhost:${process.env.PORT || 3000}`;
    const scheme = process.env.SCHEME || 'http';
    const shortLink = `${scheme}://${host}/${code}`;

    writeLog({
      event: 'create_shorturl',
      ts: new Date().toISOString(),
      shortcode: code,
      expiryAt: expiryAt.toISOString(),
    });

    return res.status(201).json({ shortLink, expiry: expiryAt.toISOString() });
  } catch (err) {
    writeLog({ event: 'error', ts: new Date().toISOString(), message: err.message });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get Short URL Stats
async function getStats(req, res) {
  try {
    const code = req.params.shortcode;
    const short = await ShortUrl.findOne({ shortcode: code }).lean();
    if (!short) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    const limit = Math.min(1000, Math.max(0, parseInt(req.query.limit || '100', 10)));
    const clicks = await Click.find({ shortcode: code })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    const clicksData = clicks.map((c) => ({
      timestamp: c.timestamp.toISOString(),
      referrer: c.referrer || null,
      geo: c.geo || null,
    }));

    return res.json({
      shortcode: short.shortcode,
      originalUrl: short.originalUrl,
      createdAt: short.createdAt.toISOString(),
      expiryAt: short.expiryAt.toISOString(),
      clicksCount: short.clicksCount || 0,
      clicks: clicksData,
    });
  } catch (err) {
    writeLog({ event: 'error', ts: new Date().toISOString(), message: err.message });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { createShortUrl, getStats };
