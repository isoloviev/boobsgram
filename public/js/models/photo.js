'use strict';

define(['angular'], function (angular) {
    angular.module('PhotoProvider', [])
        .factory('Photo', function ($http, Auth) {
            var Photo = function () {
                this.items = [];
                this.busy = false;
                this.after = 0;
                this.empty = false;
            };

            Photo.prototype.nextPage = function () {
                if (this.busy || this.empty) return;
                this.busy = true;

                var url = "/api/photos/?next=" + this.after;
                $http.get(url).success(function (data) {
                    var items = data.list;
                    for (var i = 0; i < items.length; i++) {
                        items[i].id = items[i]._id;
                        items[i].fileNameProtected = "/gim/300x300/" + (!Auth.isLoggedIn() ? 'blur/'  : '') + items[i].fileName;
                        this.items.push(items[i]);
                    }
                    if (items.length == 0) {
                        this.empty = true;
                    }
                    this.after += 12;
                    this.busy = false;
                }.bind(this));
            };

            Photo.prototype.rndList = function (cb) {
                var url = "/api/photos/?rnd=1";
                $http.get(url).success(function (data) {
                    var items = data.list;
                    var loItems = [];
                    for (var i = 0; i < items.length; i++) {
                        items[i].id = items[i]._id;
                        loItems.push(items[i]);
                    }
                    cb(null, loItems);
                }.bind(this));
            };

            Photo.prototype.postComment = function (photoId, user, comment, cb) {
                var userId = "52c2b35cb5fa3c2090126fab";
                var url = "/api/photo/" + photoId + "/comment";
                $http
                    .post(url, {
                        comment: {
                            userId: userId,
                            body: comment
                        }
                    })
                    .success(function () {
                        cb();
                    }.bind(this))
                    .error(function (e) {
                        cb(e)
                    }.bind(this));
            };

            Photo.prototype.getItem = function(pid, cb) {
                var url = "/api/photo/" + pid;
                $http
                    .get(url)
                    .success(function(data) {
                        cb(null, data.photo);
                    }.bind(this));
            };

            return Photo;
        });
    return angular;
});