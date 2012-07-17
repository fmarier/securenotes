Secures Notes using BrowserID PBEL (pronounced "pebble"), aka Password-Based Encryption in Layers.

# Requirements

This application currently requires three other components:

1. A [branch](https://github.com/fmarier/browserid/tree/keywrapping) of BrowserID
2. A [branch](https://github.com/fmarier/jwcrypto/tree/encrypt_decrypt) of jwcrypto
3. An ID-attached [keyserver](https://github.com/fmarier/keyserver)

# Installation

1. Clone the code:

        git clone git://github.com/fmarier/browserid.git
        git clone git://github.com/fmarier/jwcrypto.git
        git clone git://github.com/fmarier/keyserver.git
        git clone git://github.com/fmarier/securenotes.git

2. Switch to the right branches:

        cd browserid
        git checkout -t origin/keywrapping
        cd ../jwcrypto
        git checkout -t origin/encrypt_decrypt

3. Install the dependencies:

        cd ../browserid && npm install
        cd ../jwcrypto && npm install
        cd ../keyserver && npm install
        cd ../securenotes && npm install

4. Make BrowserID and SecureNotes use our local version of jwcrypto:

        cd ../browserid/node_modules
        rm -rf jwcrypto
        ln -s ../../jwcrypto .
        cd ../securenotes/node_modules
        rm -rf jwcrypto
        ln -s ../../jwcrypto .

5. Create the DB schemas:

        mysql -uroot -p
        > CREATE DATABASE securenotes CHARACTER SET utf8;
        > GRANT ALL ON securenotes.* TO nodeuser IDENTIFIED BY 'nodeuser';
        > CREATE DATABASE keyserver CHARACTER SET utf8;
        > GRANT ALL ON keyserver.* TO nodeuser;
        > FLUSH PRIVILEGES;
        cd securenotes
        mysql -unodeuser -p securenotes < schema.sql
        cd ../keyserver
        mysql -unodeuser -p keyserver < schema.sql

# Running

Start the required services:

    cd securenotes && npm start
    cd keyserver && npm start
    cd browserid && npm start

then log into your local instance of SecureNotes: http://127.0.0.1:8000/
