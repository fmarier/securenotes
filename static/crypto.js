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
               }, 3000);
}

function loadLocalKey() {
    // TODO: load keypair from localstorage
    return {encryptionKey: CryptoJS.SHA256('secret encryption key'),
            macKey: CryptoJS.SHA256('secret mac key')};
}

function storeLocalKey(realKey) {
    var decodedKey = JSON.parse(base64urldecode(realKey));
    // TODO: save decodedKey to localStorage
}
