'use strict';

define(function (require) {

    require('route');
    require('./project-controllers');
    require('../../../static/js/utils');
    require('../../../static/js/configs');

    angular.module('CullyApp', ['ngRoute', 'project.controllers', 'utils', 'configs'])
        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider.
                when('/overview/', {
                    templateUrl: 'partials/overview.htm'
                }).
                when('/project-summary/', {
                    templateUrl: 'partials/project-summary.htm',
                    controller: 'ProjectSummaryCtrl'
                }).
                when('/project-add/', {
                    templateUrl: 'partials/project-add.htm',
                    controller: 'ProjectAddCtrl'
                }).
                when('/project-details/:id/', {
                    templateUrl: 'partials/project-details.htm',
                    controller: 'ProjectDetailsCtrl'
                }).
                when('/project-activity-add/', {
                    templateUrl: 'partials/project-activity-add.htm',
                    controller: 'ProjectActivityAddCtrl'
                }).
                otherwise({
                    redirectTo: '/project-summary/'
                });

        } ])
        .controller('MainCtrl', ['$scope', 'currentUser', 'urlUtil',
            function ($scope, currentUser, urlUtil) {

                currentUser.username = urlUtil.getUrlParam('username');

            } ]);

    return {
        init: function () {
            angular.bootstrap(document, ['CullyApp']);
        }
    }

});