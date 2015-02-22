module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'public/js/angular/angular.js',
      'public/js/angular/angular-route.js',
      'public/js/angular/angular-mocks.js',
      'public/js/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Firefox'],

    plugins : [
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
