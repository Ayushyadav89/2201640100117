const ShortUrl = require('../model/shortUrl.js');

function isShortcodeValid(code) {
  const regex = /^[A-Za-z0-9_-]{4,32}$/;
  return regex.test(code);
}

function generateRandomCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
