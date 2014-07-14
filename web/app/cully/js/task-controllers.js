﻿'use strict';

define(function (require) {

    require('bootstrap');
    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./project-services');
    require('./task-services');

    angular.module('task.controllers', ['configs', 'filters', 'project.services', 'task.services'])
        .controller('TaskCtrl', ['$scope', '$log', 'currentUser', 'TaskService', 'UpdateTaskService', 'Update4IsUnderwayTaskService',
                                 'Update4IsCompletedTaskService', 'ParticipantService', 'userCacheUtil', 'dateUtil',
            function ($scope, $log, currentUser, TaskService, UpdateTaskService, Update4IsUnderwayTaskService,
                      Update4IsCompletedTaskService, ParticipantService, userCacheUtil, dateUtil) {

                function clear() {
                    $scope.task = {};
                    $scope.task.id = null;
                    $scope.task.content = '';
                    $scope.task.staff = '';
                    $scope.task.appointedDay = '';
                }

                function toggleTaskPanelVisibible() {
                    if ($scope.taskPanelDisplay == 'none') {
                        $scope.taskPanelDisplay = '';
                    } else {
                        $scope.taskPanelDisplay = 'none';
                        $scope.saveButtonContent = '添加任务';
                        clear();
                    }
                }

                function withIsUnderwayChanged(task) {
                    if (task.IsUnderway) {
                        task.isUnderwayStatus = 'bold';
                    } else {
                        task.isUnderwayStatus = 'normal';
                    }
                }

                function renderTask(task) {
                    var user = userCacheUtil.get(task.Staff);
                    task.staffName = (user == null) ? task.Staff : user.Name;
                    if (task.AppointedDay == null) {
                        task.isTimeAssigned = 'btn-warning';
                        task.isOverdueColor = 'btn-default';
                    } else {
                        task.isTimeAssigned = 'btn-default';
                        var d = new Date();
                        if (d >= task.AppointedDay) {
                            task.isOverdueColor = 'btn-default';
                        } else {
                            task.isOverdueColor = 'btn-danger';
                        }
                    }
                    if (currentUser.username == task.Staff) {
                        task.changeIsUnderwayButtonVisible = '';
                    } else {
                        task.changeIsUnderwayButtonVisible = 'none';
                    }
                    withIsUnderwayChanged(task);
                }

                function renderCompletedTask(task) {
                    var user = userCacheUtil.get(task.Staff);
                    task.staffName = (user == null) ? task.Staff : user.Name;
                }

                $scope.init = function () {
                    $scope.taskPanelDisplay = 'none'
                    clear();
                    var parentScope = $scope.$parent.$parent;
                    ParticipantService.query({ 'user': currentUser.username, 'projectId': parentScope.activity.ProjectId })
                        .$promise
                            .then(function (result) {
                                $scope.participants = result;
                                for (var i = 0; i < $scope.participants.length; i++) {
                                    var participant = $scope.participants[i];
                                    var user = userCacheUtil.get(participant.Staff);
                                    participant.staffName = (user == null) ? participant.Staff : user.Name;
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：成员列表加载失败";
                            });
                    TaskService.query({ 'user': currentUser.username, 'activityId': parentScope.activity.Id })
                        .$promise
                            .then(function (result) {
                                $scope.taskList = [];
                                $scope.completedTaskList = [];
                                for (var i = 0; i < result.length; i++) {
                                    var task = result[i];
                                    if (task.IsCompleted) {
                                        renderCompletedTask(task);
                                        $scope.completedTaskList.push(task);
                                    } else {
                                        renderTask(task);
                                        $scope.taskList.push(task);
                                    }
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：任务列表加载失败";
                            });
                }

                $scope.createTask = function () {
                    $scope.taskPanelDisplay = '';
                    $scope.saveButtonContent = '添加任务';
                    clear();
                }

                $scope.editTask = function (task) {
                    $scope.taskPanelDisplay = '';
                    $scope.saveButtonContent = '保存修改';
                    $scope.task.id = task.Id;
                    $scope.task.content = task.Content;
                    $scope.task.staff = task.Staff;
                    var appointedDay = dateUtil.jsonToDate(task.AppointedDay);
                    $scope.task.appointedDay = appointedDay == null ? '' : dateUtil.formatDateByYMD(appointedDay);
                }

                $scope.save = function () {
                    if ($scope.task.staff == null || $scope.task.staff == '') {
                        $scope.alertMessageVisible = 'show';
                        $scope.alertMessage = "提示：请选着要执行任务的人员";
                        return;
                    }
                    $scope.alertMessageVisible = 'hide';
                    var parentScope = $scope.$parent.$parent;
                    if ($scope.task.id == null) {
                        TaskService.save({ 'user': currentUser.username, 'activityId': parentScope.activity.Id, 'staff': $scope.task.staff, 'content': $scope.task.content, 'appointedDay': $scope.task.appointedDay })
                            .$promise
                                .then(function (result) {
                                    toggleTaskPanelVisibible();
                                    renderTask(result);
                                    $scope.taskList.unshift(result);
                                }, function (error) {
                                    $log.error(error);
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：任务保存失败";
                                });
                    } else {
                        UpdateTaskService.update({ 'user': currentUser.username, 'activityId': parentScope.activity.Id, 'id': $scope.task.id, 'staff': $scope.task.staff, 'content': $scope.task.content, 'appointedDay': $scope.task.appointedDay })
                            .$promise
                                .then(function (result) {
                                    toggleTaskPanelVisibible();
                                    renderTask(result);
                                    for (var i in $scope.taskList) {
                                        if ($scope.taskList[i].Id == result.Id) {
                                            $scope.taskList.splice(i, 1);
                                            break;
                                        }
                                    }
                                    $scope.taskList.unshift(result);
                                }, function (error) {
                                    $log.error(error);
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：任务修改失败";
                                });
                    }
                }

                $scope.cancel = function () {
                    toggleTaskPanelVisibible();
                }

                $scope.markIsUnderway = function (task) {
                    Update4IsUnderwayTaskService.update({ 'user': currentUser.username, 'activityId': task.ActivityId, 'id': task.Id, 'isUnderway': task.IsUnderway })
                        .$promise
                            .then(function (result) {
                                withIsUnderwayChanged(task);
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：任务状态修改失败";
                            });
                }

                $scope.completeTask = function (task) {
                    Update4IsCompletedTaskService.update({ 'user': currentUser.username, 'activityId': task.ActivityId, 'id': task.Id, 'isCompleted': 'true' })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.taskList) {
                                    if ($scope.taskList[i].Id == result.Id) {
                                        $scope.taskList.splice(i, 1);
                                        break;
                                    }
                                }
                                renderCompletedTask(result);
                                $scope.completedTaskList.push(result);
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：任务状态修改失败";
                            });
                }

                $scope.resumeTask = function (task) {
                    Update4IsCompletedTaskService.update({ 'user': currentUser.username, 'activityId': task.ActivityId, 'id': task.Id, 'isCompleted': 'false' })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.completedTaskList) {
                                    if ($scope.completedTaskList[i].Id == result.Id) {
                                        $scope.completedTaskList.splice(i, 1);
                                        break;
                                    }
                                }
                                renderTask(result);
                                $scope.taskList.push(result);
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：任务状态修改失败";
                            });
                }

            } ]);

});