'use strict';

define([
    'angular', 'ya'
], function (angular, ya) {

    return angular
        .module('Overview', [])
        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider.when('/', {
                templateUrl: '/js/controllers/overview/overview.html',
                controller: 'OverviewController'
            });

            $routeProvider.when('/login', {
                templateUrl: '/js/controllers/overview/login.html',
                controller: 'LoginController'
            });

            $routeProvider.when('/p/:photoId', {
                templateUrl: '/js/controllers/overview/photo.html',
                controller: 'PhotoController'
            });

            $routeProvider.when('/404', {
                templateUrl: '/js/controllers/overview/404.html'
            });

            $routeProvider.when('/_=_', {
                redirectTo: function() {
                    return "/";
                }
            });

            $routeProvider.otherwise({redirectTo: '/404'});

        }]).controller('OverviewController', ['$scope', '$location', 'Photo', function ($scope, $location, Photo) {

            // mark menu "home" as active
            $('#menu-home').parent().addClass('active');

            $scope.photo = new Photo();

        }]).controller('LoginController', ['$scope', '$location', 'Photo', function ($scope, $location, Photo) {

            // mark menu "home" as active
            $('#menu-login').parent().addClass('active');

            $scope.authWarning = ($location.search()).auth == 'req';

        }]).controller('PhotoController', ['$scope', '$location', '$routeParams', 'Photo', function ($scope, $location, $routeParams, Photo) {

            var ph = new Photo();
            $scope.item = {};

            ph.getItem($routeParams.photoId, function (e, r) {
                r.id = r._id;
                $scope.item = r;
                $scope.fileName = '/gim/750x750/' + $scope.item.fileName;

                new ya.share({
                    element: 'ya_share',
                    l10n: 'en',
                    theme: 'counter',
                    link: 'http://boobsgr.am/p/' + $scope.item.id,
                    image: "http://boobsgr.am/gim/300x300/" + $scope.item.fileName,
                    description: "Nice tits! Check this out!",
                    quickservices: "yaru,vkontakte,facebook,twitter,odnoklassniki,moimir,gplus"
                });
            });

            ph.rndList(function(e,r) {
                $scope.others = r;
            });
        }]);
});
