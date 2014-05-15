'use strict';

define(function (require) {

    require('route');
    require('./auth-controllers');

    angular.module('AuthApp', ['ngRoute', 'auth.controllers'])
        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider.
                when('/signin/', {
                    templateUrl: 'partials/sign-in.htm',
                    controller: 'SignInCtrl'
                }).
                when('/signup/', {
                    templateUrl: 'partials/sign-up.htm',
                    controller: 'SignUpCtrl'
                }).
                otherwise({
                    redirectTo: '/signin/'
                });

        } ]);

    return {
        init: function () {
            angular.bootstrap(document.body, ['AuthApp']);
        }
    }

});