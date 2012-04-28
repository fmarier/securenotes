function unwrap_key(wrapped_key) {
    var key = wrapped_key;
    return key;
}

function encrypt(wrapped_key) {
    var key = unwrap_key(wrapped_key);

    var plaintext = $('#note-content').val();
    var ciphertext = plaintext.split('').reverse().join('');
    $('#note-content').val(ciphertext);
}

function decrypt(wrapped_key) {
    var key = unwrap_key(wrapped_key);

    console.log($('#note-content').text());
    var ciphertext = $('#note-content').text();
    var plaintext = ciphertext.split('').reverse().join('');
    setTimeout(
        function () {
            $('#note-content').text(plaintext);
        }, 500);
}
