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

function hmac_sha256(s) {
    return 'TODO';
}

function encrypt() {
    $('#note-content').attr('readonly', true);
    $('#encrypt-button').hide();
    $('#encryption-message').text('Encrypting message...');

    var keypair = loadLocalKey();

    var plaintext = $('#note-content').val();
    var iv = 'TODO';

    var encryption = jwcrypto.encrypt(plaintext, keypair);
    var mac = hmac_sha256(JSON.stringify(encryption)); // TODO: do we need to mac the result?

    var data = jwcryptoutils.base64urlencode(JSON.stringify({encryption: encryption, mac: mac}));

    setTimeout(
        function () {
            $('#note-content').val(data);
            $('#encryption-message').text('Encryption completed');
            $('#save-button').removeAttr('disabled');
        }, 1000);
}

function decrypt() {
    $('#decrypt-button').hide();
    $('#decryption-message').text('Decrypting message...');

    var plaintext;
    var keypair = loadLocalKey();

    var data = JSON.parse(jwcryptoutils.base64urldecode($('#note-content').text()));

    var mac = hmac_sha256(JSON.stringify(data.encryption));
    if (mac === data.mac) {
        plaintext = jwcrypto.decrypt(data.encryption, keypair);
    }

    setTimeout(
        function () {
            $('#note-content').text(plaintext);
            $('#decryption-message').text('Decryption completed');
        }, 1000);
}

function generateUserKey(assertion, cb) {
    setTimeout(function () {
                   var key = jwcryptoutils.base64urlencode(JSON.stringify(
                       {encryptionKey: jwcryptolibs.sjcl.hash.sha256.hash('secret encryption key'),
                        macKey: jwcryptolibs.sjcl.hash.sha256.hash('secret mac key')}));
                   var wrappedKey = key.split('').reverse().join(''); // TODO: actually wrap the key!

                   cb(key, wrappedKey);
               }, 2000);
}

function loadLocalKey() {
    var keypair = localStorage.getItem('keypair');
    // TODO: if it's not available, should we redirect to /loggedin?
    return JSON.parse(keypair);
}

function storeLocalKey(realKey) {
    var decodedKey = jwcryptoutils.base64urldecode(realKey);
    localStorage.setItem('keypair', decodedKey);
}
