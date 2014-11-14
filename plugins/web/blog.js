exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/blog',
        handler: function (request, reply) {
            return reply.view('blog'); 
        }
    });

    next();

    plugin.route({
        method: 'GET',
        path: '/blog/{slug}',
        handler: function (request, reply) {
            return reply.view('single-post'); 
        }
    });

    next();
};


exports.register.attributes = {
    name: 'blog'
};