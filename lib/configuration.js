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
        }
    }).loadFile(__dirname + '/config.json').validate();
