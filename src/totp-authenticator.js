'use strict';
var crypto = require('crypto');
var b32 = require('thirty-two');
var { totp } = require('notp');

/**
 * Generate a key
 */
function generateOtpKey() {
  /**
   * 20 cryptographically random binary bytes (160-bit key)
   */
  var key = crypto.randomBytes(20);

  return key;
}

/**
 * Text-encode the key as base32 (in the style of Google Authenticator - same as Facebook, Microsoft, etc)
 * @param {Buffer} buf Buffer containing random bytes
 */
function encodePrivateKey(buf) {
  /**
   * 32 ASCII characters without trailing '='s
   */
  var base32 = b32.encode(buf).toString('utf8').replace(/=/g, '');

  /**
   * Lowercase with a space every 4 characters
   */
  var key = base32.toLowerCase().replace(/(\w{4})/g, "$1 ").trim();

  return key;
}

function generatePrivateKey() {
  return encodePrivateKey(generateOtpKey());
}

/**
 * Binary-decode the key from base32 (Google Authenticator, FB, MS, etc)
 * @param {string} key Key to decode
 */
function decodePrivateKey(key) {
  /**
   * Decode base32 private key to binary
   */
  var unformatted = key.replace(/\W+/g, '').toUpperCase();
  var bin = b32.decode(unformatted);

  return bin;
}

/**
 * Generate a TOTP token given a private key
 * @param {string} key Private key
 */
function generateToken(key) {
  var bin = decodePrivateKey(key);

  return totp.gen(bin);
}

/**
 * Verify a Google Auth Token
 * @param {string} key Private key
 * @param {string} token TOTP token
 */
function verifyToken(key, token) {
  var bin = decodePrivateKey(key);
  var formattedToken = token.replace(/\W+/g, '');

  /**
   * Window is +/- 1 period of 30 seconds
   */
  return totp.verify(formattedToken, bin, { window: 1, time: 30 });
}

/**
 * generates an `OTPAUTH://` scheme URI for QR Code generation
 * @param {string} secret User private key
 * @param {string} accountName User's username/email
 * @param {string?} issuer Provider name where the 2FA/MFA auth is implemented
 * @param {string?} algorithm (Optional) Algorithm being used. Default: SHA1
 * @param {number?} digits Amount of digits that the TOTP tokens will have. Default: 6
 * @param {number?} period Time duration (in seconds) of a TOTP token. Default: 30
 */
function generateTotpUri(secret, accountName, issuer, algorithm, digits, period) {
  /**
   * Full OTPAUTH URI spec as explained at https://github.com/google/google-authenticator/wiki/Key-Uri-Format
   */
  var uri = 'otpauth://totp/'
    + encodeURI(issuer || '') + ':' + encodeURI(accountName || '')
    + '?secret=' + secret.replace(/[\s\.\_\-]+/g, '').toUpperCase()
    + '&issuer=' + encodeURIComponent(issuer || '')
    + '&algorithm=' + (algorithm || 'SHA1')
    + '&digits=' + (digits || 6)
    + '&period=' + (period || 30);

  return uri;
}

module.exports.generatePrivateKey = generatePrivateKey;
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
module.exports.generateTotpUri = generateTotpUri;
