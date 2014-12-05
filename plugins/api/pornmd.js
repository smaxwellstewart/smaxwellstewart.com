var fs = require('fs');
var Joi = require('joi');
var Hoek = require('hoek');
var slug = require('slug');
var authPlugin = require('../auth');

exports.register = function (plugin, options, next) {
    var Search = plugin.plugins.models.Search;

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    plugin.route({
        method: 'GET',
        path: options.basePath + '/search/find',
        config: {
            validate: {
                query: {
                    keyword: Joi.string(),
                    segment: Joi.string(),
                    fields: Joi.string(),
                    sort: Joi.string(),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
        },
        handler: function (request, reply) {

            
            var query = {};
            if (request.query.keyword) {
                query.$text =  { $search:  request.query.keyword };
            }
            if (request.query.segment && request.query.segment !== 'all') {
                query.segment = request.query.segment;
            }

            var fields = request.query.fields;
            var sort = request.query.sort || '-timeCreated';
            var limit = request.query.limit;
            var page = request.query.page;

            Search.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }
                reply(results);
            });
        }
    });
    
    // Get total records in db
    var count = function (request, reply) {

        Search.count({}, function(err, count){
            if (err) {
                return reply(err);
            }
            reply(count);
        })
    };

    var breakdown = function (request, reply) {

        var agg = [
            { $group : { _id : "$segment", hits : { $sum : 1 } } }
        ];

        var match = { 
            $match: {}
        };

        if (request.query.keyword) {
            match.$match.$text ={ $search:  request.query.keyword };        
        }
        if (request.query.segment && request.query.segment !== 'all') {
            match.$match.segment = request.query.segment;
        }

        if (request.query.keyword || request.query.segment) {
            agg.unshift(match);
        }
        
        Search.aggregate(agg, function (err, results) {

            if (err) {
                return reply(err);
            }
            reply(results);
        });
    };

    var hits = function (request, reply) {


        var agg = [
            { $group : { _id : "$keyword", hits : { $sum : 1 } } },
            { $sort : { hits : -1} },
        ];

        var match = { 
            $match: {}
        };

        if (request.query.keyword) {
            match.$match.$text ={ $search:  request.query.keyword };        
        }
        if (request.query.segment && request.query.segment !== 'all') {
            match.$match.segment = request.query.segment;
        }

        if (request.query.keyword || request.query.segment) {
            agg.unshift(match);
        }



        var limit = { $limit : request.query.limit };
        agg.push(limit);

        var skip = { $skip : (request.query.page -1)*request.query.limit };
        agg.push(skip);
        
        Search.aggregate(agg, function (err, results) {

            if (err) {
                return reply(err);
            }
            reply(results);
        });
    };





    plugin.route({
        method: 'GET',
        path: options.basePath + '/search/agg',
        config: {
            validate: {
                query: {
                    keyword: Joi.string(),
                    segment: Joi.string(),
                    fields: Joi.string(),
                    sort: Joi.string(),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                [
                    { method: count, assign: 'count' },
                    { method: breakdown, assign: 'breakdown' },
                    { method: hits, assign: 'hits' }
                ]
            ],
        },
        handler: function(request, reply) {
            var limit = request.query.limit;
            var page = request.query.page;

            var output = {
                topHits: request.pre.hits,
                pages: {
                    current: page,
                    prev: 0,
                    hasPrev: false,
                    next: 0,
                    hasNext: false,
                    total: 0
                },
                items: {
                    limit: limit,
                    begin: ((page * limit) - limit) + 1,
                    end: page * limit,
                    total: 0
                }
            };

            
            var segments = {
                t: 0,
                s: 0, 
                g: 0
            }
            request.pre.breakdown.forEach(function(elem){
                segments[elem._id] = elem.hits;
                output.items.total += elem.hits;
            });
            output.segments = segments;
            output.items.percent = (output.items.total/request.pre.count)*100;

            // paging calculations
            output.pages.total = Math.ceil(output.items.total / limit);
            output.pages.next = output.pages.current + 1;
            output.pages.hasNext = output.pages.next <= output.pages.total;
            output.pages.prev = output.pages.current - 1;
            output.pages.hasPrev = output.pages.prev !== 0;
            if (output.items.begin > output.items.total) {
                output.items.begin = output.items.total;
            }
            if (output.items.end > output.items.total) {
                output.items.end = output.items.total;
            }

            reply(output);
        }
    });


    

    next();
};


exports.register.attributes = {
    name: 'search'
};
