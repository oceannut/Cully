'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('./project-services');

    angular.module('project.controllers', ['configs', 'project.services'])
        .controller('ProjectListCtrl', ['$scope', '$location', 'currentUser',
            function ($scope, $location, currentUser) {

                console.log("hi:" + currentUser.username);

                $scope.createProject = function () {
                    console.log("createProject");
                    $location.path('/project-add/');
                }

                $scope.createActivity = function () {
                    console.log("createActivity");
                    $location.path('/activity-add/');
                }

            } ])
        .controller('ProjectAddCtrl', ['$scope', '$location', 'currentUser', 'ProjectService',
            function ($scope, $location, currentUser, ProjectService) {

                $scope.save = function () {
                    console.log("save");
                    $scope.staffs = [];
                    //$scope.staffs.push('you');
                    //$scope.staffs.push('me');
                    ProjectService.save({ 'name': $scope.name, 'description': $scope.description, 'staffs': $scope.staffs, 'creator': currentUser.username })
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