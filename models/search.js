var Joi = require('joi');
var extend = require('extend-object');
var BaseModel = require('./base');
var StatusEntry = require('./status-entry');
var NoteEntry = require('./note-entry');


var Search = BaseModel.extend({
    constructor: function (attrs) {

        extend(this, attrs);
    }
});


Search._collection = 'searches';


Search.schema = Joi.object().keys({
    _id: Joi.object(),
    text: Joi.string().required(),
    timeCreated: Joi.date()
});


Search.indexes = [
    [{ keyword: 'text' }, { default_language: "english", background: true }],
    [{ segment: 1 }, { background: true }]
];


Search.create = function (doc, callback) {

    var document = doc;
    doc.timeCreated = new Date();

    this.insert(document, function (err, searches) {

        if (err) {
            return callback(err);
        }

        callback(null, searches[0]);
    });
};


// Search.summary = function (agg, callback) {
//     this.aggregate(agg, callback);
// };


module.exports = Search;
