function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}


function isShortcodeValid(code) {
  const regex = /^[A-Za-z0-9_-]{4,32}$/;
  return regex.test(code);
}

function isValidValidity(minutes) {
  return Number.isInteger(minutes) && minutes > 0;
}

module.exports = {
  isValidUrl,
  isShortcodeValid,
  isValidValidity,
};
