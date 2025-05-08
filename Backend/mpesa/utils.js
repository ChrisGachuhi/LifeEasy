/**
 * Generates a timestamp in the format YYYYMMDDHHMMSS.
 * This is required for M-Pesa API requests.
 * @returns {string} - The formatted timestamp.
 */

function generateTimestamp() {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3)
}

/**
 * Generates the security password for M-Pesa STK Push requests.
 * @param {string} shortcode - The M-Pesa Business Shortcode.
 * @param {string} passkey - The M-Pesa Passkey.
 * @param {string} timestamp - The timestamp.
 * @returns {string} - The base64 encoded password.
 */
function generatePassword(shortcode, passkey, timestamp) {
  const passwordString = `${shortcode}${passkey}${timestamp}`
  return Buffer.from(passwordString).toString('base64')
}

module.exports = {
  generateTimestamp,
  generatePassword,
}
