'use strict';

define(function (require) {

    require('bootstrap');
    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('../../../static/js/angular-directive');
    require('./project-services');
    require('./task-services');

    angular.module('task.controllers', ['configs', 'filters', 'ng-directives', 'project.services', 'task.services'])
        .controller('TaskCtrl', ['$scope', '$log', 'currentUser', 'TaskService', 'ParticipantService', 'userCacheUtil',
            function ($scope, $log, currentUser, TaskService, ParticipantService, userCacheUtil) {

                $scope.addTaskPanelDisplay = 'none';
                $scope.task = {};

                function clear() {
                    $scope.task.content = '';
                    $scope.task.staff = '';
                    $scope.task.appointedDay = '';
                }

                $scope.init = function () {
                    var parentScope = $scope.$parent.$parent;
                    ParticipantService.query({ 'user': currentUser.username, 'projectId': parentScope.activity.ProjectId })
                        .$promise
                            .then(function (result) {
                                $scope.participants = result;
                                for (var i = 0; i < $scope.participants.length; i++) {
                                    var participant = $scope.participants[i];
                                    var user = userCacheUtil.get(participant.Staff);
                                    participant.StaffName = (user == null) ? participant.Staff : user.Name;
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：成员列表加载失败";
                            });
                    TaskService.query({ 'user': currentUser.username, 'activityId': parentScope.activity.Id })
                        .$promise
                            .then(function (result) {
                                $scope.taskList = result;
                                for (var i = 0; i < $scope.taskList.length; i++) {
                                    var task = $scope.taskList[i];
                                    var user = userCacheUtil.get(task.Staff);
                                    task.StaffName = (user == null) ? task.Staff : user.Name;
                                    if (task.AppointedDay == null) {
                                        task.isAppointed = false;
                                    } else {
                                        task.isAppointed = true;
                                    }
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：任务列表加载失败";
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
                    if ($scope.task.staff == null || $scope.task.staff == '') {
                        $scope.alertMessageVisible = 'show';
                        $scope.alertMessage = "提示：请选着要执行任务的人员";
                        return;
                    }
                    $scope.alertMessageVisible = 'hide';
                    var parentScope = $scope.$parent.$parent;
                    TaskService.save({ 'user': currentUser.username, 'activityId': parentScope.activity.Id, 'staff': $scope.task.staff, 'content': $scope.task.content, 'appointedDay': $scope.task.appointedDay })
                        .$promise
                            .then(function (result) {
                                clear();
                                $scope.toggleAddTaskPanelVisibible();
                                var user = userCacheUtil.get(result.Staff);
                                result.StaffName = (user == null) ? result.Staff : user.Name;
                                $scope.taskList.unshift(result);
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：任务保存失败";
                            });
                }

                $scope.cancel = function () {
                    $scope.addTaskPanelDisplay = 'none';
                    clear();
                }

            } ]);

});