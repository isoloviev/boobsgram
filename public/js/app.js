'use strict';

require.config({
    urlArgs: window.appConfig.isProduction ? "" : "noCache=" + (new Date()).getTime(),
    paths: {
        angular: '../libs/angular',
        angularLoader: '../libs/loading-bar.min',
        angularRoute: '../libs/angular-route.min',
        angularTouch: '../libs/angular-touch.min',
        angularCookies: '../libs/angular-cookies.min',
        angularStrap: '../libs/angular-strap.min',
        'angular-file-upload': '../libs/angular-file-upload',
        bootstrap: '../libs/bootstrap.min',
        jquery: '../libs/jquery.min',
        jqueryScroll: '../libs/jquery.custom-scrollbar.min',
        jqueryCookies: '../libs/jquery.cookie',
        ya: '//yandex.st/share/share'
    },
    shim: {
        bootstrap: {
            exports: 'bootstrap',
            deps: ['jquery']
        },
        angular: {
            exports: 'angular'
        },
        angularLoader: {
            deps: ['angular']
        },
        angularRoute: {
            deps: ['angular']
        },
        angularCookies: {
            deps: ['angular']
        },
        angularTouch: {
            deps: ['angular']
        },
        angularStrap: {
            deps: ['angular']
        },
        'angular-file-upload': {
            deps: ['angular']
        },
        jquery: {
            exports: '$'
        },
        jqueryScroll: {
            deps: ['jquery']
        },
        'jqueryCookies': {
            deps: ['jquery']
        },
        ya: {
            exports: 'Ya'
        }
    }
});

require([
    'angular',
    'angularLoader',
    'angularRoute',
    'angularTouch',
    'angularStrap',
    'angularCookies',
    'bootstrap',
    'jquery',
    'modules/routingConfig',
    'modules/AccessLevel',
    'models/user',
    'models/photo',
    'controllers/overview/overview',
    'controllers/upload/upload',
    'controllers/management/management',
    'directives/modal/modal',
    'directives/scroll/scroll',
    'directives/photo/photo',
    'directives/comments/comments',
    'directives/warning/warning',
    'directives/access/accessLevel',
    'angular-file-upload',
    'jqueryCookies'
], function (angular) {

    var app = angular.module('App', ['ngCookies', 'ngRoute', 'ngTouch', 'chieffancypants.loadingBar', 'Overview', 'Upload', 'Management', 'AccessLevelProvider', 'AccessLevelDirective', 'ModalDirective', 'UserProvider', 'PhotoProvider', '$strap.directives', 'angularFileUpload', 'infinite-scroll', 'boobs-photo', 'boobs-comments', 'boobs-warning'])
        .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

            $locationProvider.html5Mode(true);

            var interceptor = ['$location', '$q', function ($location, $q) {
                function success(response) {
                    return response;
                }

                function error(response) {

                    if (response.status === 401) {
                        $location.path('/login/');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }

                return function (promise) {
                    return promise.then(success, error);
                }
            }];

            $httpProvider.responseInterceptors.push(interceptor);

        }])
        .controller('AppController', ['$scope', '$location', '$rootScope', 'Auth', function ($scope, $location, $rootScope, Auth) {

            $scope.user = Auth.user;
            $scope.userRoles = Auth.userRoles;
            $scope.accessLevels = Auth.accessLevels;
            $rootScope.lastViewedPhoto = null;

            $('body').keydown(function(e) {
                if (e.keyCode == 13 && e.ctrlKey) {
                    if ($rootScope.lastViewedPhoto) {
                        $('#' + $rootScope.lastViewedPhoto + ' a').click();
                    } else {
                        $('#photo-list').find('> div:first a').click();
                    }
                    e.stopPropagation();
                }
            });

            $scope.logout = function () {
                if (confirm('Are you sure you want to logout?')) {
                    Auth.logout(function () {
                        $location.path("/login/");
                    })
                }
            };

            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                $rootScope.error = null;

                $('.nav-pills li').removeClass('active');

                if (!Auth.authorize(next.access)) {
                    if (Auth.isLoggedIn()) $location.path('/');
                    else                  {

                        $location.search('auth', 'req');
                        $location.path('/login/');
                    }
                }
            });

        }]);

    angular.bootstrap(document, ['App']);

    return app;

});