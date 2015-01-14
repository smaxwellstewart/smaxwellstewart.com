var fs = require('fs');
var Remarkable = require('remarkable');
var Md = new Remarkable();

Md.set({
  html: true,
  breaks: true
});
exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/blog',
        handler: function (request, reply) {
            return reply.view('blog', {
                title: request.query.category || 'Blog'
            }); 
        }
    });

    next();

    plugin.route({
        method: 'GET',
        path: '/blog/{slug}',
        handler: function (request, reply) {
            var Blog = request.server.plugins.models.Blog;

            Blog.findBySlug(request.params.slug, function (err, article) {

                if (err) {
                    return reply(err);
                }

                if (!article) {
                    return reply.view('404', { title: 'Article not found.' }).code(404);
                }
                article.date = article.timeCreated.toString();

                var pathname = __dirname+'/articles/'+article.slug+'.md';

                var md = fs.readFileSync(pathname, 'utf8');
                
                article.html = Md.render(md);

                reply.view('single-post', article); 
            });
            
        }
    });

    next();
};


exports.register.attributes = {
    name: 'blog'
};