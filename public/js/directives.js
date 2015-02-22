/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2014 Webapplayers.com
 *
 */

 /**
 * Blog pic strip
 */
function blogIsotope() {
     return {
         restrict: 'E',
         templateUrl: 'views/blog-isotope.html'
     }
};

 /**
 * Blog listing
 */
function blogListing() {
     return {
         restrict: 'E',
         templateUrl: 'views/blog-listing.html'
     }
}

function blogCategories() {
    return {
        restrict: 'E',
        templateUrl: 'views/blog-categories.html'
    }
}

function blogRecent() {
    return {
        restrict: 'E',
        templateUrl: 'views/blog-recent.html'
    }
}


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title
                var title = 'smaxwellstewart.com | Home';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'smaxwellstewart.com | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};


/**
 *
 * Pass all functions into module
 */
angular
    .module('mySite.directives', [
        'ui.bootstrap'
    ])
    .directive('pageTitle', pageTitle)
    .directive('blogListing', blogListing)
    .directive('blogIsotope', blogIsotope)
    .directive('blogCategories', blogCategories)
    .directive('blogRecent', blogRecent)
