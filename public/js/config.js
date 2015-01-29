/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2014 Webapplayers.com
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "views/landing.html",
            data: { pageTitle: 'Example view' }
        })
        .state('blog', {
            url: "/blog",
            templateUrl: "views/blog.html",
            data: { pageTitle: 'Example view' }
        })


}
angular
    .module('mySite')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
