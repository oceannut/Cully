'use strict';

define(function (require) {

    require('angular');

    angular.module('auth.controllers', [])
        .controller('SignInCtrl', ['$scope', '$location',
            function ($scope, $location) {
                console.log("signin");

                $scope.login = function () {
                    window.location.href = "../cully/index.htm?username=" + $scope.username;
                }

            } ])
        .controller('SignUpCtrl', ['$scope', '$location', 'currentUser',
            function ($scope, $location, currentUser) {

                console.log("signup");

            } ]);

});