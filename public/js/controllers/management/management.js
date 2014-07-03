'use strict';

define([
    'angular'
], function (angular) {

    return angular
        .module('Management', [])
        .config(['$routeProvider', function ($routeProvider) {

            var levels = routingConfig.accessLevels;

            $routeProvider.when('/management', {
                templateUrl: '/js/controllers/management/main.html',
                controller: 'MainController',
                access: levels.admin
            });

        }]).controller('MainController', ['$scope', '$location', '$http', 'Photo', function ($scope, $location, $http, Photo) {

            // mark menu "management" as active
            $('#menu-mgmnt').parent().addClass('active');

            $scope.users = [];

            var loadUsers = function () {
                $http
                    .get("/api/users")
                    .success(function (data) {

                        $scope.users = data.list;

                    }.bind(this));
            };

            var loadPhotos = function () {
                $scope.photo = new Photo();
                $scope.photo.nextPage();
            };

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

                if ($(e.target).attr('href') == '#photos') {
                    loadPhotos();
                } else {
                    loadUsers();
                }
                $.cookie('mngTabs', $(e.target).attr('href'));
            });

            $('#mgmTabs').find('a[href="' + ($.cookie('mngTabs') ? $.cookie('mngTabs') : 'users') + '"]').tab('show');

            $scope.openProfile = function (item) {
                $location.path("")
            }

        }]);
});
