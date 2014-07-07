'use strict';

define(function (require) {

    require('route');
    require('./biz-notification-controllers');
    require('./project-controllers');
    require('./activity-controllers');
    require('./task-controllers');
    require('./log-controllers');
    require('./cache');
    require('../../../static/js/utils');
    require('../../../static/js/configs');
    require('../../common/js/user-services');

    angular.module('CullyApp',
        ['ngRoute',
            'bizNotification.controllers',
            'project.controllers',
            'activity.controllers',
            'task.controllers',
            'log.controllers',
            'cache',
            'utils',
            'configs',
            'user.services'])
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
                when('/activity-add/', {
                    templateUrl: 'partials/activity-add.htm',
                    controller: 'ActivityAddCtrl'
                }).
                when('/activity-details/:id/', {
                    templateUrl: 'partials/activity-details.htm',
                    controller: 'ActivityDetailsCtrl'
                }).
                when('/log-summary/', {
                    templateUrl: 'partials/log-summary.htm',
                    controller: 'LogSummaryCtrl'
                }).
                when('/log-add/', {
                    templateUrl: 'partials/log-add.htm',
                    controller: 'LogAddCtrl'
                }).
                when('/log-edit/:id/', {
                    templateUrl: 'partials/log-edit.htm',
                    controller: 'LogEditCtrl'
                }).
                when('/log-details/:id/', {
                    templateUrl: 'partials/log-details.htm',
                    controller: 'LogDetailsCtrl'
                }).
                otherwise({
                    redirectTo: '/overview/'
                });

        } ])
        .controller('MainCtrl', ['$scope', '$log', 'currentUser', 'urlUtil', 'UserService', 'userCacheUtil', 'categoryCacheUtil',
            function ($scope, $log, currentUser, urlUtil, UserService, userCacheUtil, categoryCacheUtil) {

                $scope.init = function () {
                    currentUser.username = urlUtil.getUrlParam('username');

                    UserService.get({ 'username': currentUser.username })
                        .$promise
                            .then(function (result) {
                                currentUser.name = result.Name;
                                $scope.user = { 'name': currentUser.name };
                            }, function (error) {
                                $log.error(error);
                            });

                    userCacheUtil.init();
                    categoryCacheUtil.init('activity');
                }

            } ]);

    return {
        init: function () {
            angular.bootstrap(document, ['CullyApp']);
        }
    }

});