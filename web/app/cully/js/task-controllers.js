'use strict';

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
                    var d = new Date();
                    if (task.AppointedDay == null) {
                        task.isTimeAssigned = 'btn-warning';
                        task.isOverdueColor = 'btn-default';
                    } else {
                        task.isTimeAssigned = 'btn-default';
                        if (d <= dateUtil.jsonToDate(task.AppointedDay)) {
                            task.isOverdueColor = 'btn-default';
                        } else {
                            task.isOverdueColor = 'btn-danger';
                        }
                    }
                    if (currentUser.username == task.Staff) {
                        task.changeIsUnderwayButtonVisible = '';
                        task.completeButtonDisabled = false;
                        task.completeButtonContent = "完成任务";
                    } else {
                        task.changeIsUnderwayButtonVisible = 'none';
                        task.completeButtonDisabled = true;
                        task.completeButtonContent = "未完成";
                    }
                    if (task.AppointedDay != null) {
                        var appointedDay = dateUtil.jsonToDate(task.AppointedDay);
                        appointedDay.setHours(23);
                        appointedDay.setMinutes(59);
                        appointedDay.setSeconds(59);
                        //console.log(d);
                        //console.log(appointedDay);
                        if (d <= appointedDay) {
                            task.completeButtonContent += "(还剩" + dateUtil.getDateDiff(d, appointedDay, 'day') + "天)";
                        } else {
                            task.completeButtonContent += "(已逾期)";
                        }
                    }
                    withIsUnderwayChanged(task);
                }

                function renderCompletedTask(task) {
                    // do nothing.
                }

                function interceptByTime(rawList, renderList, renderFunc) {
                    if (rawList != null) {
                        rawList.sort(function (e1, e2) {
                            if (e1.Creation > e2.Creation) {
                                return -1;
                            } else if (e1.Creation < e2.Creation) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    }
                    var temp = new Date();
                    temp.setFullYear(1970, 0, 1);
                    var d = dateUtil.formatDateByYMD(temp);
                    for (var i = 0; i < rawList.length; i++) {
                        var task = rawList[i];
                        var creation = dateUtil.formatDateByYMD(dateUtil.jsonToDate(task.Creation));
                        var addLabel = false;
                        if (d != creation) {
                            d = creation;
                            addLabel = true;
                        }
                        task.isLabel = false;
                        if (addLabel) {
                            renderList.push({ 'isLabel': true, 'label': d });
                        }
                        renderFunc(task);
                        renderList.push(task);
                    }
                }

                function interceptByStaff(rawList, renderList, renderFunc) {
                    if (rawList != null) {
                        rawList.sort(function (e1, e2) {
                            if (e1.staffName > e2.staffName) {
                                return -1;
                            } else if (e1.staffName < e2.staffName) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    }
                    var temp = '';
                    for (var i = 0; i < rawList.length; i++) {
                        var task = rawList[i];
                        var addLabel = false;
                        if (temp != task.staffName) {
                            temp = task.staffName;
                            addLabel = true;
                        }
                        task.isLabel = false;
                        if (addLabel) {
                            renderList.push({ 'isLabel': true, 'label': temp });
                        }
                        renderFunc(task);
                        renderList.push(task);
                    }
                }

                $scope.init = function () {
                    $scope.taskPanelDisplay = 'none'
                    clear();
                    var parentScope = $scope.$parent.$parent;
                    if (currentUser.username == parentScope.activity.Creator) {
                        $scope.addTaskButtonVisible = '';
                        $scope.resumeButtonVisible = '';
                    } else {
                        $scope.addTaskButtonVisible = 'none';
                        $scope.resumeButtonVisible = 'none';
                    }
                    ParticipantService.query({ 'user': currentUser.username, 'projectId': parentScope.activity.ProjectId })
                        .$promise
                            .then(function (result) {
                                $scope.participants = result;
                                if ($scope.participants != null) {
                                    for (var i = 0; i < $scope.participants.length; i++) {
                                        var participant = $scope.participants[i];
                                        var user = userCacheUtil.get(participant.Staff);
                                        participant.staffName = (user == null) ? participant.Staff : user.Name;
                                    }
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：成员列表加载失败";
                            });
                    TaskService.query({ 'user': currentUser.username, 'activityId': parentScope.activity.Id })
                        .$promise
                            .then(function (result) {
                                $scope.rawTaskList = [];
                                $scope.rawCompletedTaskList = [];
                                if (result != null) {
                                    for (var i = 0; i < result.length; i++) {
                                        var task = result[i];
                                        var user = userCacheUtil.get(task.Staff);
                                        task.staffName = (user == null) ? task.Staff : user.Name;
                                        if (task.IsCompleted) {
                                            $scope.rawCompletedTaskList.push(task);
                                        } else {
                                            $scope.rawTaskList.push(task);
                                        }
                                    }
                                    $scope.sortByTime();
                                    //$scope.sortByStaff();
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：任务列表加载失败";
                            });
                }



                $scope.sortByTime = function () {
                    $scope.sortByTimeActive = 'active';
                    $scope.sortByStaffActive = '';
                    $scope.taskList = [];
                    interceptByTime($scope.rawTaskList, $scope.taskList, renderTask);
                    $scope.completedTaskList = [];
                    interceptByTime($scope.rawCompletedTaskList, $scope.completedTaskList, renderCompletedTask);
                }

                $scope.sortByStaff = function () {
                    $scope.sortByTimeActive = '';
                    $scope.sortByStaffActive = 'active';
                    $scope.taskList = [];
                    interceptByStaff($scope.rawTaskList, $scope.taskList, renderTask);
                    $scope.completedTaskList = [];
                    interceptByStaff($scope.rawCompletedTaskList, $scope.completedTaskList, renderCompletedTask);
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