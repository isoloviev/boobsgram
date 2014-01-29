'use strict';

define(['angular'], function (angular) {

    return angular.module('ErrorHandler', []).factory('Error', ['$http', '$compile', function ($http, $compile) {

        return {
            error: function (message) {
                // email is already exist
                if (message.code == 101) {
                    return 'Адрес эл. почты уже имеется в системе.';
                }
                if (message.code == 404) {
                    return 'Данные не найдены.';
                }
                if (message.code == 400) {
                    return 'Запрос отклонен.';
                }
                if (message.message)
                    return message.message;
                return 'Возникла ошибка. Попробуйте еще раз.'
            }
        }
    }]);
});