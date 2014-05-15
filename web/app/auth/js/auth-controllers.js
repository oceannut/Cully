'use strict';

define(function (require) {

    require('angular');

    angular.module('auth.controllers', [])
        .value('currentUser', { username: '' })
        .controller('SignInCtrl', ['$scope', '$location', 'currentUser',
            function ($scope, $location, currentUser) {
                console.log("signin");
                //console.log("username=" + currentUser.username);

                $scope.login = function () {
                    currentUser.username = $scope.username;
                    console.log("username=" + currentUser.username);
                    //$location.path('/paper');
                }

            } ])
        .controller('SignUpCtrl', ['$scope', '$location', 'currentUser',
            function ($scope, $location, currentUser) {

                console.log("signup");

               

            } ]);

});