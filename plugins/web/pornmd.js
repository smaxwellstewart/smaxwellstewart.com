var qs = require('querystring');
exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/labs/fap-searches',
        handler: function (request, reply) {
            if(request.query.keyword === '') {
                delete request.query.keyword;
            }
            var queryString = qs.stringify(request.query);

            plugin.servers[0].inject('http://localhost.com/api/search/agg?'+queryString, function(res){
                var data = JSON.parse(res.payload);
                return reply.view('fap', {
                 title: 'Fap Searches',
                    query: request.query,
                    data: data
                });
            });

            
        }
    });

    next();
};


exports.register.attributes = {
    name: 'fap'
};