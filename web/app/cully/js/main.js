'use strict';

define(function (require) {

    require('route');
    require('./project-controllers');

    angular.module('CullyApp', ['ngRoute', 'project.controllers'])
        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider.
                when('/overview/', {
                    templateUrl: 'partials/overview.htm'
                }).
                when('/project-list/', {
                    templateUrl: 'partials/project-list.htm',
                    controller: 'ProjectListCtrl'
                }).
                when('/project-add/', {
                    templateUrl: 'partials/project-add.htm',
                    controller: 'ProjectAddCtrl'
                }).
                when('/project-details/', {
                    templateUrl: 'partials/project-details.htm',
                    controller: 'ProjectDetailsCtrl'
                }).
                otherwise({
                    redirectTo: '/overview/'
                });

        } ]);

    return {
        init: function () {
            angular.bootstrap(document.body, ['CullyApp']);
        }
    }

});