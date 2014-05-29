'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('./project-services');

    angular.module('project.controllers', ['configs', 'project.services'])
        .controller('ProjectSummaryCtrl', ['$scope', '$location', 'currentUser',
            function ($scope, $location, currentUser) {

                $scope.createProject = function () {
                    console.log("createProject");
                    $location.path('/project-add/');
                }

                $scope.createActivity = function () {
                    console.log("createActivity");
                    $location.path('/project-activity-add/');
                }

            } ])
        .controller('ProjectListCtrl', ['$scope', '$location', 'currentUser', 'TopProjectService',
            function ($scope, $location, currentUser, TopProjectService) {

                $scope.init = function () {
                    TopProjectService.query({ 'user': currentUser.username, 'count': 10 })
                        .$promise
                            .then(function (result) {
                                $scope.projectList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.gotoDetails = function (id) {
                    $location.path('/project-details/' + id + "/");
                }

                $scope.init();

            } ])
        .controller('ProjectAddCtrl', ['$scope', '$location', 'currentUser', 'ProjectService',
            function ($scope, $location, currentUser, ProjectService) {

                $scope.save = function () {
                    console.log("save");
                    $scope.participants = [];
                    ProjectService.save({
                        'user': currentUser.username,
                        'name': $scope.name,
                        'description': $scope.description,
                        'participants': $scope.participants
                    })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                                $location.path('/project-details/' + result.Id + "/");
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.cancel = function () {
                    console.log("cancel");
                    $location.path('/project-list/');
                }

            } ])
        .controller('ProjectDetailsCtrl', ['$scope', '$location', '$routeParams', 'currentUser', 'ActivityService',
            function ($scope, $location, $routeParams, currentUser, ActivityService) {

                $scope.init = function () {
                    ActivityService.query({ 'user': currentUser.username, 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.activityList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.init();

            } ])
        .controller('ActivityListCtrl', ['$scope', '$location', 'currentUser', 'ActivityListService',
            function ($scope, $location, currentUser, ActivityListService) {

                $scope.init = function () {
                    ActivityListService.query({ 'user': currentUser.username, 'start': 0, 'count': 10 })
                        .$promise
                            .then(function (result) {
                                $scope.activityList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.init();

            } ])
        .controller('ProjectActivityAddCtrl', ['$scope', '$location', 'currentUser', 'ProjectActivityService',
            function ($scope, $location, currentUser, ProjectActivityService) {

                $scope.save = function () {
                    console.log("save hh");
                    $scope.participants = [];
                    ProjectActivityService.save({
                        'user': currentUser.username,
                        'name': $scope.name,
                        'description': $scope.description,
                        'participants': $scope.participants
                    })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                                $location.path('/project-details/');
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.cancel = function () {
                    console.log("cancel");
                    $location.path('/project-list/');
                }

            } ]);

});