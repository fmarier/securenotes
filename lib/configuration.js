const
convict = require('convict');

module.exports = convict(
    {
        database: {
            user: {
                format: 'string',
                env: 'MYSQL_USER'
            },
            name: {
                format: 'string',
                env: 'DATABASE_NAME'
            },
            password: 'string?'
        },
        browserid: {
            includejs: {
                doc: "Full URL for the Javascript polyfill (include.js)",
                format: 'string = "https://login.persona.org/include.js"',
                env: 'BROWSERID_INCLUDEJS'
            },
            verifier: {
                host: {
                    doc: "Hostname of the verification service to use",
                    format: 'string = "persona.org"',
                    env: 'BROWSERID_VERIFIER_HOST'
                },
                port: {
                    doc: "Port that the verification service listens on",
                    format: 'integer{1,65535}?',
                    env: 'BROWSERID_VERIFIER_PORT'
                },
                scheme: {
                    doc: "Scheme (http or https) for the verification service",
                    format: 'string = "https"',
                    env: 'BROWSERID_VERIFIER_SCHEME'
                }
            }
        },
        bind_to: {
            host: {
                doc: "The ip address the server should bind",
                format: 'string = "127.0.0.1"',
                env: 'IP_ADDRESS'
            },
            port: {
                doc: "The port the server should bind",
                format: 'integer{1,65535}?',
                env: 'PORT'
            }
        },
        public_url: {
            doc: "The URL which this service is publicly available",
            format: 'string',
            env: 'PUBLIC_URL'
        }
    }).loadFile(__dirname + '/config.json').validate();
