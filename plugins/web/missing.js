exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/{path*}',
        handler: function (request, reply) {
            return reply.view('404', {
            	title: 'Page not found.'
            }).code(404); 
        }
    });

    next();
};


exports.register.attributes = {
    name: 'missing'
};