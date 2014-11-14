var Joi = require('joi');
var async = require('async');
var slug = require('slug');
var extend = require('extend-object');
var BaseModel = require('./base');


var Blog = BaseModel.extend({
    constructor: function (attrs) {

        extend(this, attrs);


    },
});


Blog._collection = 'blog';


Blog.schema = Joi.object().keys({
    _id: Joi.object(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    img: Joi.string(),
    author: Joi.string().required(),
    article: Joi.string().required(),
    category: Joi.string().required(),
    tags: Joi.array(),
    timeCreated: Joi.date()
});

Blog.indexes = [
    [{ slug: 1 }, { unique: true }],
    [{ title: "text" }],
    [{ article: "text" }],

];


Blog.create = function (blog, callback) {


    var document = blog;
    document.slug = slug(document.title);
    document.timeCreated = new Date();

    this.insert(document, function (err, blogs) {

        if (err) {
            return callback(err);
        }

        callback(null, blogs[0]);
    });
};


Blog.findBySlug = function (slug, callback) {

    var query = { 'slug': slug };
    this.findOne(query, callback);
};

Blog.info = function (callback) {

    var agg = [
      {
        $group : {
           _id : "$category",
           count: { $sum: 1 }
        }
      }
    ];
    // this.aggregation(agg, callback);
};


module.exports = Blog;
