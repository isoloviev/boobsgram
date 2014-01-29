'use strict';

define(['angular', 'jquery', 'jqueryScroll'], function (angular) {

    return angular.module('boobs-photo', [])

        .directive('photoThumb', [
            '$rootScope', '$window', '$filter', '$http', '$compile', '$location', 'Auth', function ($rootScope, $window, $filter, $http, $compile, $location, Auth) {
                return {
                    templateUrl: '/js/directives/photo/thumb.html',
                    scope: {
                        item: '='
                    },
                    restrict: 'E',
                    link: function (scope, elem, attrs) {

                        var $el = $(elem).find('img');

                        $(window).on('resize', doResize.bind(this, null));

                        function doResize($rel) {
                            var cel = $el;
                            if ($rel) {
                                cel = $rel;
                            }
                            $(elem).find('.thumb-hover').width(cel.width());
                            $(elem).find('.thumb-hover').css('top', cel.height() - 39);
                            $(elem).find('.thumb-hover').fadeIn();
                        }

                        var $element;

                        scope.show = function (item) {

                            if (!Auth.isLoggedIn()) {
                                $location.search('auth', 'req');
                                $location.path("/login");
                                return;
                            }

                            var loader, template;

                            loader = $http.get('/js/directives/photo/display.html')
                                .success(function (data) {
                                    template = data;
                                });

                            loader.then(function () {
                                //compile templates/form_modal.html and wrap it in a jQuery object
                                $element = $($compile(template)(scope));
                                $element.modal('show');

                                $element.on('hidden.bs.modal', function (e) {
                                    $(e.target).remove();
                                });
                            });

                        };

                        var photoNavigation = function (o) {
                            if (o[0] && o[0].id.indexOf('photo') > -1) {
                                $element.modal('hide');
                                $element.on('hidden.bs.modal', function (e) {
                                    o.find('a').click();
                                    $('html, body').animate({
                                        scrollTop: o.offset().top
                                    }, 2000);
                                });
                            }
                        };

                        scope.goPrev = function () {
                            photoNavigation($('#photo-' + scope.item.id).prev());
                        };

                        scope.goNext = function () {
                            photoNavigation($('#photo-' + scope.item.id).next());
                        };

                    }
                }
            }])
        .directive('photoShortThumb', [
            '$location', function ($location) {
                return {
                    templateUrl: '/js/directives/photo/short-thumb.html',
                    scope: {
                        item: '='
                    },
                    restrict: 'E',
                    link: function (scope, elem, attrs) {
                        scope.show = function (item) {
                            $location.path("/p/" + item.id);
                        }
                    }
                }
            }])
        .directive('imageonload', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.bind('load', function() {
                        var photoId = attrs.photoId;
                        var find = $('#photo-' + photoId).find('.thumb-hover');
                        find.width(element.width());
                        find.css('top', element.height() - 39);
                        find.fadeIn();
                    });
                }
            };
        });
});
