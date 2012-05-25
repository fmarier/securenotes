// FIXME: these /lib/ (hardcoded in bidbundle.js) are a bit undesirable since they don't match the file layout of this project
var jwcrypto = require('./lib/jwcrypto.js');

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

function loadLocalKey() {
    // TODO: if it's not available, should we redirect to /loggedin?
    return localStorage.getItem('encryptionkey');
}

function storeLocalKey(plainKey) {
    localStorage.setItem('encryptionkey', plainKey);
}
