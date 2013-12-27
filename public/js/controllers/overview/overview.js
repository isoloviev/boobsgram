'use strict';

define([
    'angular'
], function (angular) {

    return angular
        .module('Overview', [])
        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider.when('/', {
                templateUrl: 'js/controllers/overview/overview.html',
                controller: 'OverviewController'
            });

            $routeProvider.when('/404', {
                templateUrl: '404'
            });

            $routeProvider.otherwise({redirectTo: '/404'});

        }]).controller('OverviewController', ['$scope', '$location', 'Photo', function ($scope, $location, Photo) {

            $scope.photo = new Photo();

        }]);
});
