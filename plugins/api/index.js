var Hoek = require('hoek');


exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    plugin.route({
        method: 'GET',
        path: options.basePath,
        handler: function (request, reply) {

            reply({ message: 'Hapi hapi joi joi.' });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'home'
};
