exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            return reply.view('index', {
            	title: 'Software Developer'
            }); 
        }
    });

    next();
};


exports.register.attributes = {
    name: 'index'
};