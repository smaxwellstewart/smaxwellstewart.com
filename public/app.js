(function() {
    var app = angular.module('myBlog', []);

    app.directive('blogRecentPostsIsotope', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/blog-isotope.html'
        }
    });
    
    app.directive('blogListing', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/blog-listing.html'
        }
    });

    app.filter('markdown', function ($sce) {
        return function (md) {
            if (!md) {
                return '';
            };

            var html = marked(md);
            return $sce.trustAsHtml(html);;
        };
    });

    app.filter('snippet', function ($sce) {
        return function (md) {
            if (!md) {
                return '';
            };

            var max = 200;
            var tail = '... ';

            md = md.substr(0, max);

            var lastspace = md.lastIndexOf('\n');
            if (lastspace != -1) {
                md = md.substr(0, lastspace);
            }
            md = md + tail;

            var html = marked(md);
            return $sce.trustAsHtml(html);;
        };
    });

    app.controller('BlogCtrl', ['$timeout', '$http', function($timeout, $http, Blog) {
        var blog = this;

        var makePortfolio = function () {
            var $container = $('.portfolio'),
            $items = $container.find('.portfolio-item'),
            portfolioLayout = 'fitRows';

            if( $container.hasClass('portfolio-centered') ) {
                portfolioLayout = 'masonry';
            }

            $container.isotope({
                filter: '*',
                animationEngine: 'best-available',
                layoutMode: portfolioLayout,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                },
                masonry: {
                }
            }, refreshWaypoints());

            function refreshWaypoints() {
                setTimeout(function() {
                }, 1000);
            }

            $('nav.portfolio-filter ul a').on('click', function() {
                var selector = $(this).attr('data-filter');
                $container.isotope({ filter: selector }, refreshWaypoints());
                $('nav.portfolio-filter ul a').removeClass('active');
                $(this).addClass('active');
                return false;
            });

            function getColumnNumber() {
                var winWidth = $(window).width(),
                columnNumber = 1;

                if (winWidth > 1200) {
                    columnNumber = 5;
                } else if (winWidth > 950) {
                    columnNumber = 4;
                } else if (winWidth > 600) {
                    columnNumber = 3;
                } else if (winWidth > 400) {
                    columnNumber = 2;
                } else if (winWidth > 250) {
                    columnNumber = 1;
                }
                return columnNumber;
            }

            function setColumns() {
                var winWidth = $(window).width(),
                columnNumber = getColumnNumber(),
                itemWidth = Math.floor(winWidth / columnNumber);

                var portfolio = $container.find('.portfolio-item');
                $.each(portfolio, function(index, value) {
                    $(this).css( {
                        width : itemWidth + 'px'
                    });
                });
            }

            function setPortfolio() {
                setColumns();
                $container.isotope('reLayout');
            }

            $container.imagesLoaded(function () {
                setPortfolio();
            });

            $(window).on('resize', function () {
                setPortfolio();
            });
        }

        var prettyPhoto = function() {
            $('a[data-gal]').each(function() {
                jQuery(this).attr('rel', jQuery(this).data('gal'));
            });
            $("a[data-rel^='prettyPhoto']").prettyPhoto({animationSpeed:'slow',theme:'light_square',slideshow:false,overlay_gallery: false,social_tools:false,deeplinking:false});

        }

        blog.articles = [];

        $http.get('/api/blog').success(function(data) {
            console.log("HERERHERRE")
            blog.articles = data.data;
            // PORTFOLIO STUFF
            $timeout( makePortfolio, 0);
            $timeout( prettyPhoto, 0);
        })
    } ]);
})();
