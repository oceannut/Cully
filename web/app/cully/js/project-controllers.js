'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');

    angular.module('project.controllers', ['configs'])
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
        .controller('ProjectAddCtrl', ['$scope', '$location',
            function ($scope, $location) {

                $scope.save = function () {
                    console.log("save");
                    $location.path('/project-details/');
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