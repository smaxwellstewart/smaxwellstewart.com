var composer = require('./index');


composer(function (err, pack) {

    if (err) {
        throw err;
    }

    pack.start(function () {
    	console.log('Server started at: ', pack.info);

        console.log('Started the plot device.');
    });
});
