'use strict';

define(['angular', 'jquery', 'jqueryScroll'], function (angular) {

    return angular.module('boobs-comments', [])

        .directive('comments', [
            '$rootScope', '$window', '$filter', '$http', '$compile', '$timeout', '$sce', function ($rootScope, $window, $filter, $http, $compile, $timeout, $sce) {
                return {
                    templateUrl: '/js/directives/comments/list.html',
                    scope: {
                        photo: '='
                    },
                    restrict: 'E',
                    link: function (scope, elem, attrs) {

                        scope.post = "";
                        scope.busy = false;
                        scope.errors = null;

                        scope.parseDate = function (str) {
                            var d = new Date(str);
                            return $filter('date')(d, 'dd.MM.yy @ HH:mm');
                        };

                        var loadComments = function (doScroll) {

                            if (!scope.photo.id) {
                                return;
                            }

                            var url = "/api/photo/" + scope.photo.id + "/comments";
                            $http
                                .get(url)
                                .success(function (data) {

                                    scope.items = data.list;

                                    $timeout(function () {
                                        var $comment = $("#photo-comment-" + scope.photo.id + " .comment-area");
                                        $comment.customScrollbar();
                                        if (doScroll) {
                                            $comment.customScrollbar("scrollTo", "#photo-comment-" + scope.photo.id + " .comment-last-holder");
                                        }
                                        $.each($comment.find(".comment-body"), function (i, item) {
                                            item = $(item);
                                            item.html(item.text().replace(/@\w+/g, '<a href="/u/$&">$&</a>').replace(/\/@/g, '/'));
                                        });
                                        scope.busy = false;
                                    }, 150);

                                }.bind(this));
                        };

                        loadComments();

                        scope.submit = function () {
                            scope.busy = true;
                            // todo remove hardcode
                            var userId = "52c2b35cb5fa3c2090126fab";
                            var url = "/api/photo/" + scope.photo.id + "/comment";
                            $http
                                .post(url, {
                                    comment: {
                                        userId: userId,
                                        body: scope.post
                                    }
                                })
                                .success(function () {

                                    scope.post = "";

                                    loadComments(true);

                                    //                        $scope.photo.getItem(pid, function (e, it) {
//                            // refresh the list of comments
//                            for (var p in $scope.photo.items) {
//                                var item = $scope.photo.items[p];
//                                if (item.id == pid) {
//                                    it.id = it._id;
//                                    $scope.photo.items[p] = it;
//                                    break;
//                                }
//                            }
//                        });

                                }.bind(this))
                                .error(function (e) {
                                    scope.errors = e;
                                    scope.busy = false;
                                }.bind(this));
                        };


                    }
                }
            }]);
});