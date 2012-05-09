function unwrapKey(assertion, wrappedKey, cb) {
    setTimeout(function () {
                   var key = wrappedKey;
                   cb(key);
               }, 3000);
}

function encrypt(wrappedKey) {
    var key = loadLocalKey();

    var plaintext = $('#note-content').val();
    var ciphertext = plaintext.split('').reverse().join('');
    $('#note-content').val(ciphertext);
}

function decrypt(wrappedKey) {
    var key = loadLocalKey();

    var ciphertext = $('#note-content').text();
    var plaintext = ciphertext.split('').reverse().join('');
    setTimeout(
        function () {
            $('#note-content').text(plaintext);
        }, 500);
}

function generateUserKey(assertion, cb) {
    setTimeout(function () {
                   var key = '13';
                   var wrappedKey = key;

                   cb(key, wrappedKey);
               }, 3000);
}

function loadLocalKey() {
    return '13'; // TODO: load key from localstorage
}

function storeLocalKey(realKey) {
    // TODO: save key to localStorage
}
