'use strict';

define(function (require) {

    require('route');
    require('./biz-notification-controllers');
    require('./project-controllers');
    require('./activity-controllers');
    require('./task-controllers');
    require('./participant-controllers');
    require('./log-controllers');
    require('./cache');
    require('../../../static/js/utils');
    require('../../../static/js/configs');
    require('../../../static/js/angular-directive');
    require('../../common/js/user-services');

    angular.module('CullyApp',
        ['ngRoute',
            'bizNotification.controllers',
            'project.controllers',
            'activity.controllers',
            'task.controllers',
            'participant.controllers',
            'log.controllers',
            'cache',
            'ng-directives',
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
                when('/project-edit/:id/', {
                    templateUrl: 'partials/project-edit.htm',
                    controller: 'ProjectEditCtrl'
                }).
                when('/project-details/:id/', {
                    templateUrl: 'partials/project-details.htm',
                    controller: 'ProjectDetailsCtrl'
                }).
                when('/activity-add/', {
                    templateUrl: 'partials/activity-add.htm',
                    controller: 'ActivityAddCtrl'
                }).
                when('/activity-edit/:id/', {
                    templateUrl: 'partials/activity-edit.htm',
                    controller: 'ActivityEditCtrl'
                }).
                when('/activity-details/:id/', {
                    templateUrl: 'partials/activity-details.htm',
                    controller: 'ActivityDetailsCtrl'
                }).
                when('/task-edit/:id/', {
                    templateUrl: 'partials/task-edit.htm',
                    controller: 'TaskEditCtrl'
                }).
                when('/task-details/:id/', {
                    templateUrl: 'partials/task-details.htm',
                    controller: 'TaskDetailsCtrl'
                }).
                when('/task-notification-list/:id/', {
                    templateUrl: 'partials/task-notification-list.htm',
                    controller: 'TaskNotificationListCtrl'
                }).
                when('/participant-list/:projectId/', {
                    templateUrl: 'partials/participant-list.htm',
                    controller: 'ParticipantListCtrl'
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
                when('/notification-list/', {
                    templateUrl: 'partials/notification-list.htm',
                    controller: 'BizNotificationListCtrl'
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

                    $scope.$watch('notificationCount', function () {
                        if ($scope.notificationCount > 0) {
                            $scope.notificationCountColor = 'label-danger';
                        } else {
                            $scope.notificationCountColor = 'label-default';
                        }
                    });
                }

            } ]);

    return {
        init: function () {
            angular.bootstrap(document, ['CullyApp']);
        }
    }

});