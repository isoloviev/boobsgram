'use strict';

define([
    'angular'
], function (angular) {

    return angular
        .module('Upload', [])
        .config(['$routeProvider', function ($routeProvider) {

            var levels = routingConfig.accessLevels;

            $routeProvider.when('/upload.html', {
                templateUrl: '/js/controllers/upload/upload.html',
                controller: 'UploadController',
                access: levels.user
            });

        }]).controller('UploadController', ['$scope', '$location', '$fileUploader', function ($scope, $location, $fileUploader) {

            // create a uploader with options
            var uploader = $scope.uploader = $fileUploader.create({
                scope: $scope,                          // to automatically update the html. Default: $rootScope
                url: '/api/upload/',
                formData: [
                    { key: 'value' }
                ],
                filters: [
                    function (item) {
                        return item.type == "image/jpeg";
                    }
                ]
            });

            $scope.uploadCompleted = false;

            uploader.bind('completeall', function (event, items) {
                $scope.uploadCompleted = true;
            });


        }]);
});
