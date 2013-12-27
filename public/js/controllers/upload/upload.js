'use strict';

define([
    'angular'
], function (angular) {

    return angular
        .module('Upload', [])
        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider.when('/upload.html', {
                templateUrl: '/js/controllers/upload/upload.html',
                controller: 'UploadController'
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


            // REGISTER HANDLERS

            uploader.bind('afteraddingfile', function (event, item) {
                console.info('After adding a file', item);
            });

            uploader.bind('afteraddingall', function (event, items) {
                console.info('After adding all files', items);
            });

            uploader.bind('changedqueue', function (event, items) {
                console.info('Changed queue', items);
            });

            uploader.bind('beforeupload', function (event, item) {
                console.info('Before upload', item);
            });

            uploader.bind('progress', function (event, item, progress) {
                console.info('Progress: ' + progress, item);
            });

            uploader.bind('success', function (event, xhr, item, response) {
                console.info('Success', xhr, item, response);
            });

            uploader.bind('error', function (event, xhr, item, response) {
                console.info('Error', xhr, item, response);
            });

            uploader.bind('complete', function (event, xhr, item, response) {
                console.info('Complete', xhr, item, response);
            });

            uploader.bind('progressall', function (event, progress) {
                console.info('Total progress: ' + progress);
            });

            uploader.bind('completeall', function (event, items) {
                console.info('All files are transferred', items);
            });


        }]);
});
