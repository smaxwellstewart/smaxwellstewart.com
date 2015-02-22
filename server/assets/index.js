exports.register = function (server, options, next) {

	server.route({
		method: 'GET',
		path: '/cv',
		handler: {
			file: './public/cv.html'
		}
	});

	server.route({
		method: 'GET',
		path: '/js/{path*}',
		handler: {
			directory: {
				path: './public/js/',
				listing: true
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/packages/{path*}',
		handler: {
			directory: {
				path: './public/packages/',
				listing: true
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/views/{path*}',
		handler: {
			directory: {
				path: './public/views/',
				listing: true
			}
		}
	});





    return next();
};


exports.register.attributes = {
    name: 'assets'
};
