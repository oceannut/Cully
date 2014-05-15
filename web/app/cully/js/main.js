'use strict';

define(function (require) {

    require('route');

    angular.module('CullyApp', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider.
                when('/home/', {
                    templateUrl: 'partials/home.htm'
                }).
                when('/project-list/', {
                    templateUrl: 'partials/project-list.htm'
                }).
                otherwise({
                    redirectTo: '/home/'
                });

        } ]);

    return {
        init: function () {
            angular.bootstrap(document.body, ['CullyApp']);
        }
    }

});