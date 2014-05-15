'use strict';

define(function (require) {

    require('angular');

    angular.module('project.controllers', [])
        .controller('ProjectListCtrl', ['$scope', '$location',
            function ($scope, $location) {

                $scope.createProject = function () {
                    console.log("createProject");
                    $location.path('/project-add/');
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

                

            } ]);

});