function encrypt(text) {
    let base64 = require('base64-js');
    return base64.toByteArray(text).toString();
}

function decrypt(bytes) {
    let base64 = require('base64-js');
    return base64.fromByteArray(bytes).toString();
}

module.exports = { encrypt, decrypt };