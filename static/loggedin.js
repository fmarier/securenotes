function doUnwrap(assertion, wrappedKey) {
    $("#message").text('Unwrapping your key...');

    navigator.id.secret.unwrap(
        assertion, wrappedKey, function (plainKey) {
            localStorage.removeItem('assertion');
            storeLocalKey(plainKey);

            $("#message").text('All done');
            window.location = '/list';
        });
}

function doGenerate(assertion) {
    $("#message").text('Generating a key...');

    navigator.id.secret.generateAndWrap(
        assertion, function (plainKey, wrappedKey) {
            localStorage.removeItem('assertion');
            storeLocalKey(plainKey);

            // Send wrapped key to the server to be stored in the DB
            var data = {wrappedKey: wrappedKey}; // TODO: add CSRF protection
            $.post('/loggedin', data, function (res) {
                       // TODO: check for errors
                       $("#message").text('All done');
                       window.location = '/list';
                    }, 'json');
        });
}
