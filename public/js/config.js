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
    $locationProvider.html5Mode(true).hashPrefix('!');

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

        .state('blog.posts', {
            url: "/posts/:category",
            templateUrl: "views/blog-listing.html",
            data: { pageTitle: 'Example view' },
            controller: function($scope, $stateParams){
                $scope.filters.category = $stateParams.category;
            }
        })
        .state('blog.root', {
            url: "/posts",
            templateUrl: "views/blog-listing.html",
            data: { pageTitle: 'Example view' },
            controller: function($scope, $stateParams){
                $scope.filters = {};
            }
        })
        .state('blog.post', {
            url: "/post/{articleId}",
            templateUrl: "views/blog-single.html",
            data: { pageTitle: 'Example view' },
            controller: function($scope, $stateParams, blogService) {
                $scope.$parent.blog.getPost($stateParams.articleId)
                // console.log(heres);

            }
        })


}
angular
    .module('mySite.config', [
        'ui.router'
    ])
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
