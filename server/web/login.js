exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/login',
        handler: function (request, reply) {
            return reply.view('login'); 
        }
    });

    next();
};


exports.register.attributes = {
    name: 'web-login'
};
