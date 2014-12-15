var qs = require('querystring');
exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/labs/fap-searches',
        handler: function (request, reply) {
            return reply.redirect('http://www.fapsearches.info');

            
        }
    });

    next();
};


exports.register.attributes = {
    name: 'fap'
};