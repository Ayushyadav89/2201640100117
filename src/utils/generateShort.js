// utils/generateShortcode.js

const ShortUrl = require('../models/ShortUrl');

/**
 * Validate a given shortcode.
 * Allowed: 4–32 chars, letters, numbers, underscores, dashes
 */
function isShortcodeValid(code) {
  const regex = /^[A-Za-z0-9_-]{4,32}$/;
  return regex.test(code);
}

/**
 * Generate a random shortcode of given length (default 6).
 */
function generateRandomCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a unique shortcode not already in DB.
 */
async function generateUniqueShortcode(length = 6) {
  let code;
  let exists = true;

  while (exists) {
    code = generateRandomCode(length);
    exists = await ShortUrl.findOne({ shortcode: code }).lean();
  }

  return code;
}

module.exports = {
  isShortcodeValid,
  generateRandomCode,
  generateUniqueShortcode,
};
