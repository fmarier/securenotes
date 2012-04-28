// TODO: move to client-side

exports.generate_user_key = function (cb) {
    var key = '13';
    setTimeout(cb(key), 500);
};

exports.wrap_key = function (email, key, cb) {
    var wrapped_key = key;
    setTimeout(cb(wrapped_key), 500);
};
