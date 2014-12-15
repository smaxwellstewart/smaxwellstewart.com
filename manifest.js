var Confidence = require('confidence');
var config = require('./config');
var criteria = {
    env: process.env.NODE_ENV
};


var manifest = {
    $meta: 'This file defines the plot device.',
    servers: [{
        host: '127.0.0.1',
        port: config.get('/port/web'),
        options: {
            security: true,
            debug: {
                request: ['error']
            },
            labels: ['web']
        }
    }],
    plugins: {
        'hapi-auth-basic': {},
        'lout': {},
        'visionary': {
            engines: { html: 'swig' },
            path: './plugins/web/views/'
        },
        './plugins/auth': {},
        './plugins/models': {},
        './plugins/mailer': {},
        './plugins/api/accounts': { basePath: '/api' },
        './plugins/api/admin-groups': { basePath: '/api' },
        './plugins/api/admins': { basePath: '/api' },
        './plugins/api/auth-attempts': { basePath: '/api' },
        './plugins/api/contact': { basePath: '/api' },
        './plugins/api/index': { basePath: '/api' },
        './plugins/api/login': { basePath: '/api' },
        './plugins/api/logout': { basePath: '/api' },
        './plugins/api/sessions': { basePath: '/api' },
        './plugins/api/signup': { basePath: '/api' },
        './plugins/api/statuses': { basePath: '/api' },
        './plugins/api/users': { basePath: '/api' },
        './plugins/api/blogs': { basePath: '/api' },
        './plugins/web/assets': {},
        './plugins/web/missing': {},
        './plugins/web/index': {},
        './plugins/web/login': {},
        './plugins/web/blog': {},
        './plugins/web/cv': {},
        './plugins/web/pornmd': {}
        

    }
};


var store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
