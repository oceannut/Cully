'use strict';

define(function (require) {

    angular.module('auth.models', [])
        .constant("authorizationType", { authorised: 0,
            loginRequired: 1,
            notAuthorised: 2
        })
        .factory("currentUser", ['$log', function ($log) {

            var username, pwd, name, roles;
            var login = false;

            return {
                sign_in: function (userToken, signature) {
                    if (userToken == undefined || userToken == '') {
                        username = undefined;
                        pwd = undefined;
                        login = false;
                        $log.error("Invalid user sign in");
                    } else {
                        username = userToken;
                        pwd = signature;
                        login = true;
                    }
                },
                sign_out: function () {
                    username = undefined;
                    pwd = undefined;
                    name = undefined;
                    roles = undefined;
                    login = false;
                },
                setDetails: function (options) {
                    options = options || {};
                    if (options.name != undefined) {
                        name = options.name;
                    }
                    if (options.roles != undefined) {
                        roles = options.roles;
                    }
                },
                getUsername: function () {
                    return username;
                },
                getSignature: function () {
                    return pwd;
                },
                getName: function () {
                    return name;
                },
                getRoles: function () {
                    return roles;
                },
                isLogin: function () {
                    return login;
                },
                changePwd: function (newPwd) {
                    pwd = newPwd;
                }
            }

        } ])
        .factory("authorization", ['authorizationType', 'currentUser', function (authorizationType, currentUser) {

            return {
                authorize: function (loginRequired, requiredRoles) {

                    var result = authorizationType.authorised,
                    loweredRoles = [],
                    isInRole = true,
                    role, i;

                    if (loginRequired === true && !currentUser.isLogin()) {
                        result = authorizationType.loginRequired;
                    } else if ((loginRequired === true && currentUser.isLogin()) && (requiredRoles === undefined || requiredRoles.length === 0)) {
                        // Login is required but no specific permissions are specified.
                        result = authorizationType.authorised;
                    } else if (requiredRoles) {
                        loweredRoles = [];
                        angular.forEach(currentUser.getRoles(), function (role) {
                            loweredRoles.push(role.toLowerCase());
                        });

                        for (i = 0; i < requiredRoles.length; i += 1) {
                            role = requiredRoles[i].toLowerCase();

                            isInRole = loweredRoles.indexOf(role) > -1;
                            // if we only need one of the permissions and we have it there is no point carrying on
                            if (isInRole) {
                                break;
                            }
                        }

                        result = isInRole ? authorizationType.authorised : authorizationType.notAuthorised;
                    }

                    return result;
                }
            }

        } ]);

});