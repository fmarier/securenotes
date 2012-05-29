function doUnwrap(identity, wrappedKey) {
    $("#message").text('Unwrapping your key...');

    navigator.id.secret.unwrap(
        identity, wrappedKey, function (plainKey) {
            localStorage.setItem('encryptionkey', plainKey);

            $("#message").text('All done');
            window.location = '/list';
        }, function (error) {
            $("#message").text('ERROR: ' + error);
        });
}

function doGenerate(identity) {
    $("#message").text('Generating a key...');

    navigator.id.secret.generateAndWrap(
        identity, function (plainKey, wrappedKey) {
            localStorage.setItem('encryptionkey', plainKey);

            // Send wrapped key to the server to be stored in the DB
            var data = {wrappedKey: wrappedKey}; // TODO: add CSRF protection
            $.post('/loggedin', data, function (res) {
                       // TODO: check for errors
                       $("#message").text('All done');
                       window.location = '/list';
                    }, 'json');
        }, function (error) {
            $("#message").text('ERROR: ' + error);
        });
}
