'use strict';

define(['angular'], function (angular) {
    angular.module('AccessLevelProvider', [])
        .factory('Auth', function ($http, $cookieStore) {

            var accessLevels = routingConfig.accessLevels
                , userRoles = routingConfig.userRoles
                , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

            $cookieStore.remove('user');

            function changeUser(user) {
                angular.extend(currentUser, user);
            }

            return {
                authorize: function (accessLevel, role) {
                    if (role === undefined)
                        role = currentUser.role;
                    if (accessLevel === undefined) {
                        accessLevel = accessLevels.public
                    }
                    return accessLevel.bitMask & role.bitMask;
                },
                isLoggedIn: function (user) {
                    if (user === undefined)
                        user = currentUser;
                    return  user.role.title == userRoles.user.title ||
                            user.role.title == userRoles.author.title ||
                            user.role.title == userRoles.moderator.title ||
                            user.role.title == userRoles.admin.title;
                },
                logout: function (success, error) {
                    $http.post('/logout').success(function () {
                        changeUser({
                            username: '',
                            role: userRoles.public
                        });
                        success();
                    }).error(error);
                },
                accessLevels: accessLevels,
                userRoles: userRoles,
                user: currentUser
            };
        });

    angular.module('AccessLevelProvider')
        .factory('Users', function ($http) {
            return {
                getAll: function (success, error) {
                    $http.get('/users').success(success).error(error);
                }
            };
        });

    return angular;
});