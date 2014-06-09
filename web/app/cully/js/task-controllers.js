'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('./project-services');
    require('./task-services');

    angular.module('task.controllers', ['configs', 'filters', 'project.services', 'task.services'])
        .controller('TaskCtrl', ['$scope', '$routeParams', 'currentUser', 'TaskService', 'ParticipantService',
            function ($scope, $routeParams, currentUser, TaskService, ParticipantService) {

                $scope.addTaskPanelDisplay = 'none';
                $scope.task = {};

                function clear() {
                    $scope.task.content = '';
                    $scope.task.staff = '';
                    $scope.task.appointedDay = '';
                }

                $scope.init = function () {
                    ParticipantService.query({ 'user': currentUser.username, 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.participants = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                    TaskService.query({ 'user': currentUser.username, 'activityId': $scope.item.Id })
                        .$promise
                            .then(function (result) {
                                $scope.taskList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.toggleAddTaskPanelVisibible = function () {
                    if ($scope.addTaskPanelDisplay == 'none') {
                        $scope.addTaskPanelDisplay = '';
                    } else {
                        $scope.addTaskPanelDisplay = 'none';
                        clear();
                    }
                }

                $scope.save = function () {

                    console.log($scope.task.content + " " + $scope.task.staff + " " + $scope.task.appointedDay);
                    TaskService.save({ 'user': currentUser.username, 'activityId': $scope.item.Id, 'staff': $scope.task.staff, 'content': $scope.task.content, 'appointedDay': $scope.task.appointedDay })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                                clear();
                                $scope.toggleAddTaskPanelVisibible();
                                $scope.taskList.unshift(result);
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.cancel = function () {
                    $scope.addTaskPanelDisplay = 'none';
                    clear();
                }

            } ]);

});