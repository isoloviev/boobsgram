'use strict';

require.config({
    urlArgs: window.appConfig.isProduction ? "" :  "noCache=" + (new Date()).getTime(),
    paths: {
        angular: '../libs/angular',
        angularLoader: '../libs/loading-bar.min',
        angularRoute: '../libs/angular-route.min',
        angularTouch: '../libs/angular-touch.min',
        angularCookies: '../libs/angular-cookies.min',
        angularStrap: '../libs/angular-strap.min',
        angularScroll: '../libs/ng-infinite-scroll',
        'angular-file-upload': '../libs/angular-file-upload',
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.1/jquery.min',
        bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min'
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
        angularScroll: {
            deps: ['angular']
        },
        jquery: {
            exports: '$'
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
    'models/user',
    'models/photo',
    'controllers/overview/overview',
    'controllers/upload/upload',
    'directives/modal/modal',
    'errorHandler',
    'angular-file-upload',
    'angularScroll'
], function (angular) {

    var app = angular.module('App', ['ngCookies', 'ngRoute', 'ngTouch', 'chieffancypants.loadingBar', 'Overview', 'Upload', 'ModalDirective', 'UserProvider', 'PhotoProvider', '$strap.directives', 'ErrorHandler', 'angularFileUpload', 'infinite-scroll'])
        .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

            $locationProvider.html5Mode(true);

        }])
        .controller('AppController', ['$scope', '$location', 'User', 'Error', '$window', function ($scope, $location, User, Error, $window) {

            $scope.loggedIn = false;
            $scope.user = {
                rememberme: true
            };
            $scope.errors = {};

            $scope.login = function () {
                _clearErrors();
                return User.login($scope.user)
                    .success(_registered)
                    .error(_errored);
            };

            $scope.sign = function () {
                _clearErrors();
                return User.register($scope.user)
                    .success(_registered)
                    .error(_errored);
            };

            $scope.openHome = function () {
                $location.path("/");
            };

            ///// TEH PRIVATE

            function _clearErrors() {
                $scope.errors = null;
                $scope.errors = {};
            }

            function _addError(field, message) {
                $scope.errors[field] = message;
            }

            function _errored(response) {
                if (response.errors) {
                    if (angular.isArray(response.errors)) {
                        Object.each(response.errors, function (field, errors) {
                            _addError(field, errors.first())
                        });

                        if (response.errors.base && Object.isString(response.errors.base)) {
                            _addError('extra', response.errors.base)
                        }
                    } else {
                        _addError('extra', Error.error(response.errors));
                    }
                }
            }

            function _registered(response) {
                $scope.loggedIn = true;
                $scope.user = {name: response.username};

                $window.location = $window.appConfig.domains.panel + "/login/a?" + response.token;
            }

        }]);

    angular.bootstrap(document, ['App']);

    return app;

});