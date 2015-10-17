var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'imagefy'
        },
        port: 3000,
        riak: ['localhost:8087']
    },

    test: {
        root: rootPath,
        app: {
            name: 'imagefy'
        },
        port: 3000,
        riak: ['localhost:8087']
    },

    production: {
        root: rootPath,
        app: {
            name: 'imagefy'
        },
        port: 3000,
        riak: ['localhost:8087']
    }
};

module.exports = config[env];
