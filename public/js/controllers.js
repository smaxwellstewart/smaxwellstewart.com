/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2014 Webapplayers.com
 *
 */


/**
 * MainCtrl - controller
 */
function MainCtrl() {

    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};

function BlogCtrl($scope, $http, $timeout, gallery, blogService) {
    var blog = this;


    $scope.filters = { };
    $scope.clearFilter = function() {
        $scope.filters = {};
    };

    blog.categories = [
        'comedy',
        'feminism',
        'tech',
    ];


    blog.articles = [];
    $scope.status;

    var getPosts = function (catgeory) {
        blogService.getPosts()
        .success(function (posts) {
            blog.articles = posts.data;
            $timeout( gallery.init, 0);
        })
        .error(function (error) {
            $scope.status = 'Unable to load article data: ' + error.message;
        });
    }

    var getPost = function(id) {
        blogService.getPost(id)
        .success(function (post) {
            blog.article = post;
        })
        .error(function (error) {
            $scope.status = 'Unable to load article data: ' + error.message;
        });
    }

    blog.getPost = getPost;
    getPosts();
}

angular
    .module('mySite.controllers', [
        'ui.bootstrap'
    ])
    .controller('MainCtrl', MainCtrl)
    .controller('BlogCtrl', ['$scope', '$http', '$timeout', 'gallery', 'blogService', BlogCtrl])
