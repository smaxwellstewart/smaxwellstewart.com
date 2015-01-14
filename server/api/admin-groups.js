var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'GET',
        path: options.basePath + '/admin-groups',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            validate: {
                query: {
                    fields: Joi.string(),
                    sort: Joi.string(),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AdminGroup = request.server.plugins['hapi-mongo-models'].AdminGroup;
            var query = {};
            var fields = request.query.fields;
            var sort = request.query.sort;
            var limit = request.query.limit;
            var page = request.query.page;

            AdminGroup.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/admin-groups/{id}',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AdminGroup = request.server.plugins['hapi-mongo-models'].AdminGroup;

            AdminGroup.findById(request.params.id, function (err, adminGroup) {

                if (err) {
                    return reply(err);
                }

                if (!adminGroup) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(adminGroup);
            });
        }
    });


    server.route({
        method: 'POST',
        path: options.basePath + '/admin-groups',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            validate: {
                payload: {
                    name: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AdminGroup = request.server.plugins['hapi-mongo-models'].AdminGroup;
            var name = request.payload.name;

            AdminGroup.create(name, function (err, adminGroup) {

                if (err) {
                    return reply(err);
                }

                reply(adminGroup);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/admin-groups/{id}',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            validate: {
                payload: {
                    name: Joi.string().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AdminGroup = request.server.plugins['hapi-mongo-models'].AdminGroup;
            var id = request.params.id;
            var update = {
                $set: {
                    name: request.payload.name
                }
            };

            AdminGroup.findByIdAndUpdate(id, update, function (err, adminGroup) {

                if (err) {
                    return reply(err);
                }

                reply(adminGroup);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/admin-groups/{id}/permissions',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            validate: {
                payload: {
                    permissions: Joi.object().required()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AdminGroup = request.server.plugins['hapi-mongo-models'].AdminGroup;
            var id = request.params.id;
            var update = {
                $set: {
                    permissions: request.payload.permissions
                }
            };

            AdminGroup.findByIdAndUpdate(id, update, function (err, adminGroup) {

                if (err) {
                    return reply(err);
                }

                reply(adminGroup);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: options.basePath + '/admin-groups/{id}',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var AdminGroup = request.server.plugins['hapi-mongo-models'].AdminGroup;

            AdminGroup.findByIdAndRemove(request.params.id, function (err, count) {

                if (err) {
                    return reply(err);
                }

                if (count === 0) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'admin-groups'
};
