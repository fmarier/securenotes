function doUnwrap(assertion, wrappedKey) {
    $("#message").text('Unwrapping your key...');

    unwrapKey(
        assertion, wrappedKey, function (realKey) {
            localStorage.removeItem('assertion');
            storeLocalKey(realKey);

            $("#message").text('All done');
            window.location = '/list';
        });

}

function doGenerate(assertion) {
    $("#message").text('Generating a key...');

    generateUserKey(
        assertion, function (realKey, wrappedKey) {
            localStorage.removeItem('assertion');
            storeLocalKey(realKey);

            // Send wrapped key to the server to be stored in the DB
            var data = {wrappedKey: wrappedKey}; // TODO: add CSRF protection
            $.post('/loggedin', data, function (res) {
                       // TODO: check for errors
                       $("#message").text('All done');
                       window.location = '/list';
                    }, 'json');
        });
}
