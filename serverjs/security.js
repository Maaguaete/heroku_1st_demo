function encrypt(text) {
    let base64 = require('base64-js');
    return base64.toByteArray(text).toString();
}

function decrypt(bytes) {
    let base64 = require('base64-js');
    return base64.fromByteArray(bytes).toString();
}

// function en_bcrypt(text) {
//     let encoded_text = "";

//     bcrypt.hash(text, 10)
//         .then(hash => {

//             text = hash;
//             console.log(pass);
//         })
//         .catch(err => {
//             console.log(err);
//         })

//     return encoded_text;
// }

// function compare(text, encryptText) {
//     bcrypt.compare(text, encryptText)
//         .then(result => { return result })
//         .catch(err => { err })

// }
// en_bcrypt("Toan@1108");

module.exports = { encrypt, decrypt };