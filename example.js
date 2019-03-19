'use strict';

var totpAuthenticator = require('./totp-authenticator');

var formattedKey = totpAuthenticator.generateKey();
console.log(formattedKey);
// "acqo ua72 d3yf a4e5 uorx ztkh j2xl 3wiz"

var formattedToken = totpAuthenticator.generateToken(formattedKey);
console.log(formattedToken);
// "957 124"

var result = totpAuthenticator.verifyToken(formattedKey, formattedToken);
console.log(result);
// { delta: 0 }

result = totpAuthenticator.verifyToken(formattedKey, '000-000');
console.log(result);
// null

// result will allways be one of
// (failure) null
// (success) { delta: -1 }, { delta: 0 }, or { delta: 1 }
// delta lets you know which way time drift is occurring
