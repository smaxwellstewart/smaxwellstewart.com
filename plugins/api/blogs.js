var fs = require('fs');
var Joi = require('joi');
var Hoek = require('hoek');
var slug = require('slug');
var authPlugin = require('../auth');


exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    plugin.route({
        method: 'GET',
        path: options.basePath + '/blog',
        config: {
            validate: {
                query: {
                    category: Joi.string(),
                    fields: Joi.string(),
                    sort: Joi.string(),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
        },
        handler: function (request, reply) {

            var Blog = request.server.plugins.models.Blog;
            var query = {};
            if (request.query.category) {
                query.category = new RegExp('^.*?'+ request.query.category +'.*$', 'i');
            }

            var fields = request.query.fields;
            var sort = request.query.sort || '-timeCreated';
            var limit = request.query.limit;
            var page = request.query.page;

            Blog.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }


                for(var i = 0; i < results.data.length; i++) {
                    var article = results.data[i];
                    article.date = article.timeCreated.toString();
                    var pathname = __dirname+'/../web/articles/'+article.slug+'.md';
                    try {
                        var md = fs.readFileSync(pathname, 'utf8');
                    } catch(err) {
                        var md = '';
                    }
                    
                    article.article = md;

                    results.data[i] = article;
                    
                }
                reply(results);
            });
        }
    });


    plugin.route({
        method: 'GET',
        path: options.basePath + '/blog/{slug}',
        handler: function (request, reply) {

            var Blog = request.server.plugins.models.Blog;

            Blog.findBySlug(request.params.slug, function (err, article) {

                if (err) {
                    return reply(err);
                }

                if (!article) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                article.date = article.timeCreated.toString();
                var pathname = __dirname+'/../web/articles/'+article.slug+'.md';
                var md = fs.readFileSync(pathname, 'utf8');
                article.article = md;

                reply(article);
            });
        }
    });


    plugin.route({
        method: 'POST',
        path: options.basePath + '/blog',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            validate: {
                payload: {
                    title: Joi.string().required(),
                    img: Joi.string(),
                    author: Joi.string().required(),
                    article: Joi.string().required(),
                    category: Joi.string().required(),
                    tags: Joi.array(),
                    timeCreated: Joi.date()
                }
            },
            pre: [
                authPlugin.preware.ensureAdminGroup('root'),
                {
                    assign: 'slugCheck',
                    method: function (request, reply) {

                        var Blog = request.server.plugins.models.Blog;
                        var conditions = {
                            slug: slug(request.payload.title)
                        };

                        Blog.findOne(conditions, function (err, user) {

                            if (err) {
                                return reply(err);
                            }

                            if (user) {
                                var response = {
                                    message: 'Blog title already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            var Blog = request.server.plugins.models.Blog;
            var document = request.payload;

            Blog.create(document, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    plugin.route({
        method: 'PUT',
        path: options.basePath + '/blog/{id}',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            validate: {
                payload: {
                    title: Joi.string().required(),
                    slug: Joi.string().required(),
                    img: Joi.string(),
                    author: Joi.string().required(),
                    article: Joi.string().required(),
                    category: Joi.string().required(),
                    tags: Joi.array(),
                    timeCreated: Joi.date()
                }
            },
            pre: [
                authPlugin.preware.ensureAdminGroup('root'),
                {
                    assign: 'slugCheck',
                    method: function (request, reply) {

                        var Blog = request.server.plugins.models.Blog;
                        var conditions = {
                            slug: request.payload.slug
                        };

                        Blog.findOne(conditions, function (err, article) {

                            if (err) {
                                return reply(err);
                            }

                            if (article && article._id !== request.params.id ) {
                                var response = {
                                    message: 'Slug already in use.'
                                };

                                return reply(response).takeover().code(409);
                            }

                            reply(true);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            var Blog = request.server.plugins.models.Blog;
            var id = request.params.id;
            var update = {
                $set: {
                    title: request.payload.title,
                    slug: request.payload.slug,
                    img: request.payload.img,
                    author: request.payload.author,
                    article: request.payload.article,
                    category: request.payload.category,
                    tags: request.payload.tags
                }
            };

            Blog.findByIdAndUpdate(id, update, function (err, user) {

                if (err) {
                    return reply(err);
                }

                reply(user);
            });
        }
    });


    


    plugin.route({
        method: 'DELETE',
        path: options.basePath + '/blog/{id}',
        config: {
            auth: {
                strategy: 'simple',
                scope: 'admin'
            },
            pre: [
                authPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var Blog = request.server.plugins.models.Blog;

            Blog.findByIdAndRemove(request.params.id, function (err, count) {

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
    name: 'blogs'
};
