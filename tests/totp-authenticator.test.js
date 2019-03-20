'use strict';
var totpAuthenticator = require('../src/totp-authenticator');

var exitStatus = 0;
function runTest(validation) {
  // Just to display the success status of a particular test
  console.log(validation);
  console.log();

  // Docs about process.exit() and exit statuses:
  // https://nodejs.org/api/process.html#process_process_exit_code
  if (exitStatus === 1) return;
  if (validation === false) exitStatus = 1;
}

console.log('generateKey()');
console.log(' - Should be a string of 39 characters long')
var formattedKey = totpAuthenticator.generateKey();
runTest(formattedKey.length === 39);

console.log('generateToken()');
console.log(' - Should be a string of 6 characters long')
var formattedToken = totpAuthenticator.generateToken(formattedKey);
runTest(formattedToken.length === 6);

console.log('verifyToken()');
console.log(' - Given a valid token, it returns an object')
var result = totpAuthenticator.verifyToken(formattedKey, formattedToken);
runTest(typeof result === 'object');

console.log(' - Given an invalid token, it returns null')
result = totpAuthenticator.verifyToken(formattedKey, '000-000');
runTest(result === null);

process.exit(exitStatus);