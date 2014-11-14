exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/cv',
        handler: function (request, reply) {
            return reply.view('cv'); 
        }
    });

    next();
};


exports.register.attributes = {
    name: 'cv'
};