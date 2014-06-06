'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('./auth-services');

    angular.module('auth.controllers', ['configs', 'auth.services'])
        .controller('SignInCtrl', ['$scope', '$location', 'currentUser', 'SignInService',
            function ($scope, $location, currentUser, SignInService) {

                console.log("signin");

                $scope.signin = function () {
                    SignInService.save({
                        'username': $scope.username,
                        'pwd': $scope.pwd
                    })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                                if (result.Code == 0) {
                                    window.location.href = "../cully/index.htm?username=" + $scope.username;
                                } else {
                                    alert(result.Message);
                                }
                            }, function (error) {
                                console.log(error);
                            });
                }

            } ])
        .controller('SignUpCtrl', ['$scope', '$location', 'currentUser', 'SignUpService',
            function ($scope, $location, currentUser, SignUpService) {

                console.log("signup");

                $scope.signup = function () {
                    SignUpService.save({
                        'username': $scope.username,
                        'pwd': $scope.pwd,
                        'name': $scope.name
                    })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                            }, function (error) {
                                console.log(error);
                            });
                }

            } ]);

});