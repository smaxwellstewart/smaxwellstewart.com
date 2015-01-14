var _ = require('lodash');

var assets = {
	development: {
		main: {
	    	css: [
	    		'main/css/bootstrap.css',
	    		'main/css/style.css',
	    		'main/css/font-awesome.min.css'
	    	],
	        js: [
	        	'main/js/bootstrap.min.js',
	        	'main/js/retina-1.1.0.js',
	        	'main/js/jquery.hoverdir.js',
	        	'main/js/jquery.hoverex.min.js',
	        	'main/js/jquery.prettyPhoto.js',
	        	'main/js/jquery.isotope.min.js',
	        	'main/js/custom.js',
                'main/js/marked.js',
                'main/js/number.min.js'
	        ]
	    }
	},
	production: {
		main: {
			js: ['main/js/scripts.js'],
        	css: ['main/css/styles.css']
		}  
    }
};

var pagePaths = {
    "index": "/",
    "blog": "/blog",
    "login": "/login",
    "singlePost": "/blog/",
    "cv": "/cv",
}

exports.register = function (server, options, next) {

	var environment = process.env.NODE_ENV || 'development';

    // Hook onto the 'onPostHandler'
    server.ext('onPostHandler', function (request, reply) {
        // Get the response object
        var response = request.response;

        // Check to see if the response is a view
        if (response.variety === 'view') {

            if(_.isEmpty(response.source.context)) {
                response.source.context = {};
            }
            if(_.isEmpty(response.source.context.assets)) {
                response.source.context.assets = {};
            }

            //pagePaths._current = 
            var pathSegments = request.route.path.split('\/');
            pathSegments.shift();
           
            if(pathSegments[0] == "") {
                pagePaths._current = 'index';
            }
            else {
                pagePaths._current = pathSegments[0];
            }
            response.source.context
            response.source.context.pages = pagePaths;

            if(_.isEmpty(response.source.context)){
                response.source.context = {};
            }

            if(_.isEmpty(response.source.context.assets)){
                response.source.context.assets = {};
            }
            if (pathSegments[0] == "labs"){
                assets[environment].main.js.push('main/js/fap.js')
                assets[environment].main.css.push('main/css/fap.css')
            }
            response.source.context.assets = assets[environment];         
        }

        return reply.continue();
    });

    server.route({
        method: 'GET',
        path: '/assets/{path*}',
        handler: {
            directory: { path: './public/' }
        }
    });


    return next();
};


exports.register.attributes = {
    name: 'assets'
};