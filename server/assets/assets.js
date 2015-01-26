var Confidence = require('confidence');


var criteria = {
  env: process.env.NODE_ENV
};


var assets = {
  $meta: 'This file configures the assets.',
  development: {
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
  },
  production: {
      js: ['main/js/scripts.js'],
      css: ['main/css/styles.css']
  }
};


var store = new Confidence.Store(config);


exports.get = function (key) {

  return store.get(key, criteria);
};


exports.meta = function (key) {

  return store.meta(key, criteria);
};
