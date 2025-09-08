// utils/validator.js

/**
 * Validate if a given string is a proper URL.
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Validate shortcode format.
 * Allowed: 4–32 chars, alphanumeric, underscore, dash
 */
function isShortcodeValid(code) {
  const regex = /^[A-Za-z0-9_-]{4,32}$/;
  return regex.test(code);
}

/**
 * Validate validity minutes.
 * Must be positive integer > 0
 */
function isValidValidity(minutes) {
  return Number.isInteger(minutes) && minutes > 0;
}

module.exports = {
  isValidUrl,
  isShortcodeValid,
  isValidValidity,
};
