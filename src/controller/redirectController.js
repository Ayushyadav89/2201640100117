const ShortUrl = require('../models/ShortUrl');
const Click = require('../models/Click');
const geoip = require('geoip-lite');
const { writeLog } = require('../middleware/logger');

async function redirectToOriginal(req, res) {
  try {
    const code = req.params.shortcode;
    const short = await ShortUrl.findOne({ shortcode: code });

    if (!short) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    // Check expiry
    if (short.expiryAt && short.expiryAt < new Date()) {
      return res.status(410).json({ error: 'Short link has expired' });
    }

    // Update clicks count
    short.clicksCount = (short.clicksCount || 0) + 1;
    await short.save();

    // Collect click data
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip) || null;
    const referrer = req.headers.referer || req.headers.referrer || null;

    const click = new Click({
      shortcode: code,
      timestamp: new Date(),
      referrer,
      geo,
    });
    await click.save();

    // Log event
    writeLog({
      event: 'redirect',
      ts: new Date().toISOString(),
      shortcode: code,
      ip,
      referrer,
      geo,
    });

    // Redirect to original URL
    return res.redirect(short.originalUrl);
  } catch (err) {
    writeLog({ event: 'error', ts: new Date().toISOString(), message: err.message });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { redirectToOriginal };
