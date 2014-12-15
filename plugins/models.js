exports.register = function (plugin, options, next) {

    var models = {
        BaseModel: require('../models/base'),
        Account: require('../models/account'),
        AdminGroup: require('../models/admin-group'),
        Admin: require('../models/admin'),
        AuthAttempt: require('../models/auth-attempt'),
        Blog: require('../models/blog'),
        Session: require('../models/session'),
        Status: require('../models/status'),
        User: require('../models/user')
    };

    models.BaseModel.connect(function (err, db) {

        if (err) {
            plugin.log('Error connecting to MongoDB via BaseModel.');
            return next(err);
        }

        Object.keys(models).forEach(function (model) {

            models[model].ensureIndexes();
            plugin.expose(model, models[model]);
        });

        next();
    });
};


exports.register.attributes = {
    name: 'models'
};
