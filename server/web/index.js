exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/{p*}',
        handler: {
            file: './public/index.html'
        }
    });

    server.ext('onPreResponse', function (request, reply) {
        var response = request.response;


        // Custom error pages
        if (response.isBoom) {

            if (response.output.statusCode === 404) {
                return reply.view('404').code(404);
            }
        }

        return reply(response);
    });

    next();
};


exports.register.attributes = {
    name: 'index'
};
