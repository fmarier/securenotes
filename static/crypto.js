// FIXME: these /lib/ (hardcoded in bidbundle.js) are a bit undesirable since they don't match the file layout of this project
var jwcrypto = require('./lib/jwcrypto.js');
var jwcryptoutils = require('./lib/utils.js');
var jwcryptolibs = require('./libs/minimal.js');

function unwrapKey(assertion, wrappedKey, cb) {
    setTimeout(function () {
                   var key = wrappedKey.split('').reverse().join(''); // TODO: actually unwrap the key
                   cb(key);
               }, 2000);
}

function encrypt() {
    $('#note-content').attr('readonly', true);
    $('#encrypt-button').hide();
    $('#encryption-message').text('Encrypting message...');

    var encryptionKey = loadLocalKey();
    var plaintext = $('#note-content').val();
    var encryption = jwcrypto.encrypt(plaintext, encryptionKey);

    setTimeout(
        function () {
            $('#note-content').val(encryption);
            $('#encryption-message').text('Encryption completed');
            $('#save-button').removeAttr('disabled');
        }, 1000);
}

function decrypt() {
    $('#decrypt-button').hide();
    $('#decryption-message').text('Decrypting message...');

    var encryptionKey = loadLocalKey();
    var plaintext = jwcrypto.decrypt($('#note-content').text(), encryptionKey);

    setTimeout(
        function () {
            $('#note-content').text(plaintext);
            $('#decryption-message').text('Decryption completed');
        }, 1000);
}

function generateUserKey(assertion, cb) {
    setTimeout(function () {
                   // TODO: generate a random key
                   var key = jwcryptoutils.base64urlencode(jwcryptolibs.sjcl.hash.sha256.hash('secret encryption key'));
                   var wrappedKey = key.split('').reverse().join(''); // TODO: actually wrap the key!

                   cb(key, wrappedKey);
               }, 2000);
}

function loadLocalKey() {
    var encryptionKey = localStorage.getItem('encryptionkey');
    // TODO: if it's not available, should we redirect to /loggedin?
    return encryptionKey;
}

function storeLocalKey(plainKey) {
    var decodedKey = jwcryptoutils.base64urldecode(plainKey);
    localStorage.setItem('encryptionkey', decodedKey);
}
