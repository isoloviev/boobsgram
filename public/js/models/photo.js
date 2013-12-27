'use strict';

define(['angular'], function (angular) {
    angular.module('PhotoProvider', [])
        .factory('Photo', function ($http) {
            var Photo = function () {
                this.items = [];
                this.busy = false;
                this.after = 10;
            };

            Photo.prototype.nextPage = function () {
                if (this.busy) return;
                this.busy = true;

                var url = "/api/photos/?next=" + this.after;
                $http.get(url).success(function (data) {
                    var items = data.list;
                    for (var i = 0; i < items.length; i++) {
                        this.items.push(items[i]);
                    }
                    this.after = this.items[this.items.length - 1].id;
                    this.busy = false;
                }.bind(this));
            };

            return Photo;
        });
    return angular;
});