// TODO: include jwcrypto directly and remove this copy of the code?
function base64urlencode(arg) {
    var s = window.btoa(arg);
    s = s.split('=')[0]; // Remove any trailing '='s
    s = s.replace(/\+/g, '-'); // 62nd char of encoding
    s = s.replace(/\//g, '_'); // 63rd char of encoding
    return s;
}

// TODO: include jwcrypto directly and remove this copy of the code?
function base64urldecode(arg) {
    var s = arg;
    s = s.replace(/-/g, '+'); // 62nd char of encoding
    s = s.replace(/_/g, '/'); // 63rd char of encoding
    switch (s.length % 4) // Pad with trailing '='s
    {
    case 0: break; // No pad chars in this case
    case 2: s += "=="; break; // Two pad chars
    case 3: s += "="; break; // One pad char
    default: throw new InputException("Illegal base64url string!");
    }
    return window.atob(s); // Standard base64 decoder
}

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
    var keypair = loadLocalKey();

    var plaintext = $('#note-content').val();
    var iv = 'TODO';

    var encryption = {ciphertext: plaintext, // TODO: encrypt the plaintext!
                      iv: iv};
    var mac = hmac_sha256(JSON.stringify(encryption));

    var data = base64urlencode(JSON.stringify({encryption: encryption, mac: mac}));

    $('#note-content').val(data);
}

function decrypt() {
    var plaintext;
    var keypair = loadLocalKey();

    var data = JSON.parse(base64urldecode($('#note-content').text()));

    var mac = hmac_sha256(JSON.stringify(data.encryption));
    if (mac === data.mac) {
        plaintext = data.encryption.ciphertext; // TODO: actual decryption
    }

    setTimeout(
        function () {
            $('#note-content').text(plaintext);
        }, 500);
}

function sha256hex(s) {
    return CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);
}

function generateUserKey(assertion, cb) {
    setTimeout(function () {
                   var key = base64urlencode(JSON.stringify(
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
    var decodedKey = base64urldecode(realKey);
    localStorage.setItem('keypair', decodedKey);
}
