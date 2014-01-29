'use strict';

define(['angular', 'jquery', 'jqueryCookies'], function (angular) {

    return angular.module('boobs-warning', [])

        .directive('adultWarning', [
            '$rootScope', '$location', function ($rootScope, $location) {
                return {
                    templateUrl: '/js/directives/warning/warning.html',
                    restrict: 'E',
                    link: function (scope, elem, attrs) {

                        elem.find('#adult-window').modal({
                            backdrop: 'static',
                            keyboard: false
                        });

                        scope.adultChecker = function()
                        {
                            $.cookie('termsAccepted', 'Y', { expires: 30, path: '/' });
                            var aw = elem.find('#adult-window');
                            aw.modal('hide');
                            aw.on('hidden.bs.modal', function () {
                                elem.remove();
                            });
                        }
                    }
                }
            }]);
});


