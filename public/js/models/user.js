'use strict';

define(['angular'], function (angular) {
    angular.module('UserProvider', [])
        .factory('User', function ($http, $cookieStore) {

            var currentUser = $cookieStore.get('user') || { username: '' };

            function changeUser(user) {
                angular.extend(currentUser, user);
            }

            var userObj = {
                name: null,
                id: null,
                username: null,
                token: null,
                loggedIn: false
            };

            function _loadUser() {
                return $http.get('/me.json')
                    .success(_loadSession);
            }

            function _loadSession(response) {
                if (response.user && response.user.username) {
                    userObj.loggedIn = true;
                    userObj.username = response.user.username;
                    userObj.name = response.user.name;
                    userObj.email = response.user.email;
                    userObj.id = response.user.id;
                    userObj.token = response.user.token;
                }
            }

            return {
                getUser: function () {
                    return _loadUser().then(function () {
                        return userObj;
                    })
                },
                register: function (user) {
                    return $http.post('/rest/register', { user: user }).success(_loadSession);
                },
                login: function (user) {
                    return $http.post('/rest/login', { user: user }).success(_loadSession);
                },
                logout: function (success, error) {
                    $http.post('/rest/logout').success(function () {
                        userObj.username = "";
                        userObj.loggedIn = false;
                    });
                }
            };
        });

    return angular;
});