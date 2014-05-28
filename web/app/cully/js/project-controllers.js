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
                    $location.path('/activity-add/');
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
                                $location.path('/project-details/');
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.cancel = function () {
                    console.log("cancel");
                    $location.path('/project-list/');
                }

            } ])
        .controller('ProjectDetailsCtrl', ['$scope', '$location',
            function ($scope, $location) {



            } ])
        .controller('ActivityAddCtrl', ['$scope', '$location',
            function ($scope, $location) {

                $scope.save = function () {
                    console.log("save");
                    $location.path('/project-details/');
                }

                $scope.cancel = function () {
                    console.log("cancel");
                    $location.path('/project-list/');
                }

            } ]);

});