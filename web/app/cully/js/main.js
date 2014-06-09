'use strict';

define(function (require) {

    require('route');
    require('./project-controllers');
    require('./task-controllers');
    require('../../../static/js/utils');
    require('../../../static/js/configs');
    require('../../common/js/user-services');

    angular.module('CullyApp', ['ngRoute', 'project.controllers', 'task.controllers', 'utils', 'configs', 'user.services'])
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
        .controller('MainCtrl', ['$scope', 'currentUser', 'urlUtil', 'UserService',
            function ($scope, currentUser, urlUtil, UserService) {

                currentUser.username = urlUtil.getUrlParam('username');

                UserService.get({ 'username': currentUser.username })
                        .$promise
                            .then(function (result) {
                                currentUser.name = result.Name;
                                $scope.user = { 'name': currentUser.name };
                            }, function (error) {
                                console.log("error: " + error);
                            });

            } ]);

    return {
        init: function () {
            angular.bootstrap(document, ['CullyApp']);
        }
    }

});