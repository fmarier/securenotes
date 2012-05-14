// FIXME: these /lib/ (hardcoded in bidbundle.js) are a bit undesirable since they don't match the file layout of this project
var jwcrypto = require('./lib/jwcrypto.js');
var jwcryptoutils = require('./lib/utils.js');

function unwrapKey(assertion, wrappedKey, cb) {
    setTimeout(function () {
                   var key = wrappedKey.split('').reverse().join('');
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

    var encryption = {ciphertext: jwcrypto.encrypt(plaintext, keypair),
                      iv: iv};
    var mac = hmac_sha256(JSON.stringify(encryption));

    var data = jwcryptoutils.base64urlencode(JSON.stringify({encryption: encryption, mac: mac}));

    setTimeout(
        function () {
            $('#note-content').val(data);
            $('#encryption-message').text('Decryption completed');
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
        plaintext = jwcrypto.decrypt(data.encryption.ciphertext, keypair);
    }

    setTimeout(
        function () {
            $('#note-content').text(plaintext);
            $('#decryption-message').text('Decryption completed');
        }, 1000);
}

function sha256hex(s) {
    return CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);
}

function generateUserKey(assertion, cb) {
    setTimeout(function () {
                   var key = jwcryptoutils.base64urlencode(JSON.stringify(
                       {encryptionKey: sha256hex('secret encryption key'),
                        macKey: sha256hex('secret mac key')}));
                   var wrappedKey = key.split('').reverse().join('');

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
