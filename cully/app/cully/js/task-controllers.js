'use strict';

define(function (require) {

    require('ng');
    require('bootstrap');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('../../../static/js/directives');
    require('./project-services');
    require('./task-services');
    require('./comment-services');
    require('../../auth/js/auth-models');
    require('../../auth/js/auth-directives');
    require('../../common/js/common-cache');
    require('../../common/js/biz-notification-services');

    angular.module('task.controllers', ['configs', 'filters', 'directives', 'project.services', 'task.services', 'comment.services', 'bizNotification.services'])
        .factory('taskServiceUtil', ['$log', 'currentUser', 'Update4IsUnderwayTaskService', 'Update4IsCompletedTaskService',
            function ($log, currentUser, Update4IsUnderwayTaskService, Update4IsCompletedTaskService) {

                return {
                    makeIsUnderway: function (task, isUnderway, callback) {
                        Update4IsUnderwayTaskService.update({ 'user': currentUser.getUsername(), 'id': task.Id, 'isUnderway': isUnderway })
                        .$promise
                            .then(function (result) {
                                task.IsUnderway = isUnderway;
                                (callback || angular.noop)(result);
                            }, function (error) {
                                $log.error(error);
                            });
                    },
                    makeIsCompleted: function (task, isCompleted, callback) {
                        Update4IsCompletedTaskService.update({ 'user': currentUser.getUsername(), 'id': task.Id, 'isCompleted': isCompleted })
                        .$promise
                            .then(function (result) {
                                task.IsCompleted = isCompleted;
                                task.IsUnderway = false;
                                (callback || angular.noop)(result);
                            }, function (error) {
                                $log.error(error);
                            });
                    }
                }

            } ])
        .controller('TaskListCtrl', ['$scope', '$location', '$log', 'currentUser', 'TaskService', 'TaskListService',
                                 'ParticipantOfProjectService', 'userCache', 'dateUtil', 'taskServiceUtil',
            function ($scope, $location, $log, currentUser, TaskService, TaskListService,
                      ParticipantOfProjectService, userCache, dateUtil, taskServiceUtil) {

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

                function buildStaffName(task) {
                    userCache.get(task.Staff, function (e) {
                        task.staffName = (e == null) ? task.Staff : e.Name;
                    });
                }

                function renderTask(task) {
                    var parentScope = $scope.$parent.$parent;
                    var currentUsername = currentUser.getUsername();
                    if (currentUsername === parentScope.activity.Creator) {
                        task.editButtonDisabled = false;
                    } else {
                        task.editButtonDisabled = true;
                    }
                    if (currentUsername === task.Staff) {
                        task.changeIsUnderwayButtonVisible = '';
                        task.completeButtonDisabled = false;
                    } else {
                        task.changeIsUnderwayButtonVisible = 'none';
                        task.completeButtonDisabled = true;
                    }
                    task.IsUnderwayChecked = task.IsUnderway;
                    task.completeButtonContent = "未完成";
                    var d = new Date();
                    if (task.AppointedDay == null) {
                        task.isTimeAssigned = 'btn-warning';
                        task.isOverdueColor = 'btn-default';
                    } else {
                        task.isTimeAssigned = 'btn-default';
                        var appointedDay = dateUtil.jsonToDate(task.AppointedDay);
                        appointedDay.setHours(23);
                        appointedDay.setMinutes(59);
                        appointedDay.setSeconds(59);
                        if (d <= appointedDay) {
                            task.isOverdueColor = 'btn-default';
                            task.completeButtonContent += "(还剩" + dateUtil.getDateDiff(d, appointedDay, 'day') + "天)";
                        } else {
                            task.isOverdueColor = 'btn-danger';
                            task.completeButtonContent += "(已逾期)";
                        }
                    }
                    withIsUnderwayChanged(task);
                }

                function renderCompletedTask(task) {

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
                        var timeStamp;
                        if (task.IsCompleted) {
                            timeStamp = dateUtil.formatDateByYMD(dateUtil.jsonToDate(task.Completion));
                        } else {
                            timeStamp = dateUtil.formatDateByYMD(dateUtil.jsonToDate(task.Creation));
                        }
                        var addLabel = false;
                        if (d != timeStamp) {
                            d = timeStamp;
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

                function load() {
                    var parentScope = $scope.$parent.$parent;
                    TaskListService.query({ 'user': currentUser.getUsername(), 'activityId': parentScope.activity.Id })
                        .$promise
                            .then(function (result) {
                                if (result != null) {
                                    for (var i = 0; i < result.length; i++) {
                                        var task = result[i];
                                        buildStaffName(task);
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

                $scope.init = function () {
                    $scope.taskPanelDisplay = 'none'
                    clear();
                    var parentScope = $scope.$parent.$parent;
                    if (currentUser.getUsername() == parentScope.activity.Creator) {
                        $scope.addTaskButtonVisible = '';
                        $scope.resumeButtonVisible = '';
                    } else {
                        $scope.addTaskButtonVisible = 'none';
                        $scope.resumeButtonVisible = 'none';
                    }
                    ParticipantOfProjectService.query({ 'user': currentUser.getUsername(), 'projectId': parentScope.activity.ProjectId })
                        .$promise
                            .then(function (result) {
                                $scope.participants = result;
                                if ($scope.participants != null) {
                                    for (var i = 0; i < $scope.participants.length; i++) {
                                        var participant = $scope.participants[i];
                                        userCache.get(participant.Staff, function (e) {
                                            participant.staffName = (e == null) ? participant.Staff : e.Name;
                                        });
                                    }
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：成员列表加载失败";
                            });

                    $scope.rawTaskList = [];
                    $scope.rawCompletedTaskList = [];
                    load();
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

                $scope.refreshTaskList = function () {
                    $scope.rawTaskList.length = 0;
                    $scope.rawCompletedTaskList.length = 0;
                    load();
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
                        TaskService.save({ 'user': currentUser.getUsername(),
                            'activityId': parentScope.activity.Id,
                            'content': $scope.task.content,
                            'staff': $scope.task.staff,
                            'appointedDay': $scope.task.appointedDay
                        })
                            .$promise
                                .then(function (result) {
                                    toggleTaskPanelVisibible();
                                    buildStaffName(result);
                                    $scope.rawTaskList.push(result);

                                    $scope.taskList = [];
                                    if ($scope.sortByTimeActive == 'active') {
                                        interceptByTime($scope.rawTaskList, $scope.taskList, renderTask);
                                    }
                                    else {
                                        interceptByStaff($scope.rawTaskList, $scope.taskList, renderTask);
                                    }
                                }, function (error) {
                                    $log.error(error);
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：任务保存失败";
                                });
                    } else {
                        TaskService.update({ 'user': currentUser.getUsername(),
                            'id': $scope.task.id,
                            'content': $scope.task.content,
                            'staff': $scope.task.staff,
                            'appointedDay': $scope.task.appointedDay
                        })
                            .$promise
                                .then(function (result) {
                                    toggleTaskPanelVisibible();
                                    for (var i in $scope.rawTaskList) {
                                        if ($scope.rawTaskList[i].Id == result.Id) {
                                            $scope.rawTaskList.splice(i, 1);
                                            break;
                                        }
                                    }
                                    buildStaffName(result);
                                    $scope.rawTaskList.push(result);

                                    $scope.taskList = [];
                                    if ($scope.sortByTimeActive == 'active') {
                                        interceptByTime($scope.rawTaskList, $scope.taskList, renderTask);
                                    }
                                    else {
                                        interceptByStaff($scope.rawTaskList, $scope.taskList, renderTask);
                                    }
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
                    if (task.IsUnderwayChecked) {
                        taskServiceUtil.makeIsUnderway(task, true, function (e) {
                            withIsUnderwayChanged(task);
                        });
                    } else {
                        taskServiceUtil.makeIsUnderway(task, false, function (e) {
                            withIsUnderwayChanged(task);
                        });
                    }
                }

                $scope.completeTask = function (task) {
                    taskServiceUtil.makeIsCompleted(task, true, function (result) {
                        for (var i in $scope.rawTaskList) {
                            if ($scope.rawTaskList[i].Id == result.Id) {
                                $scope.rawTaskList.splice(i, 1);
                                break;
                            }
                        }
                        buildStaffName(result);
                        $scope.rawCompletedTaskList.push(result);

                        $scope.taskList = [];
                        $scope.completedTaskList = [];
                        if ($scope.sortByTimeActive == 'active') {
                            interceptByTime($scope.rawTaskList, $scope.taskList, renderTask);
                            interceptByTime($scope.rawCompletedTaskList, $scope.completedTaskList, renderCompletedTask);
                        }
                        else {
                            interceptByStaff($scope.rawTaskList, $scope.taskList, renderTask);
                            interceptByStaff($scope.rawCompletedTaskList, $scope.completedTaskList, renderCompletedTask);
                        }
                    });
                }

                $scope.resumeTask = function (task) {
                    taskServiceUtil.makeIsCompleted(task, false, function (result) {
                        for (var i in $scope.rawCompletedTaskList) {
                            if ($scope.rawCompletedTaskList[i].Id == result.Id) {
                                $scope.rawCompletedTaskList.splice(i, 1);
                                break;
                            }
                        }
                        buildStaffName(result);
                        $scope.rawTaskList.push(result);

                        $scope.taskList = [];
                        $scope.completedTaskList = [];
                        if ($scope.sortByTimeActive == 'active') {
                            interceptByTime($scope.rawTaskList, $scope.taskList, renderTask);
                            interceptByTime($scope.rawCompletedTaskList, $scope.completedTaskList, renderCompletedTask);
                        }
                        else {
                            interceptByStaff($scope.rawTaskList, $scope.taskList, renderTask);
                            interceptByStaff($scope.rawCompletedTaskList, $scope.completedTaskList, renderCompletedTask);
                        }
                    });
                }

            } ])
        .controller('TaskEditCtrl', ['$scope', '$location', '$routeParams', '$log', 'currentUser', 'TaskService', 'userCache', 'dateUtil',
            function ($scope, $location, $routeParams, $log, currentUser, TaskService, userCache, dateUtil) {

                $scope.isLoading = false;
                $scope.alertMessageVisible = 'hidden';

                $scope.init = function () {
                    TaskService.get({ 'user': currentUser.getUsername(), 'id': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.task = result;
                                $scope.alertMessageVisible = 'hidden';
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：加载任务详细信息失败";
                                $log.error(error);
                            });
                }

                $scope.save = function () {
                    $scope.isLoading = true;
                    var d = '';
                    if ($scope.task.AppointedDay != null && $scope.task.AppointedDay != '') {
                        d = dateUtil.formatDateByYMD(dateUtil.jsonToDate($scope.task.AppointedDay));
                    }
                    TaskService.update({ 'user': currentUser.getUsername(),
                        'id': $scope.task.Id,
                        'content': $scope.task.Content,
                        'staff': $scope.task.Staff,
                        'appointedDay': d
                    })
                        .$promise
                            .then(function (result) {
                                $scope.isLoading = false;
                                $scope.task = result;
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-success';
                                $scope.alertMessage = "提示：修改任务成功";
                            }, function (error) {
                                $scope.isLoading = false;
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：修改任务失败";
                                $log.error(error);
                            });
                }

                $scope.deleteTask = function () {
                    TaskService.remove({ 'user': currentUser.getUsername(), 'id': $scope.task.Id })
                        .$promise
                            .then(function (result) {
                                $('#removeTaskDialog').modal('hide');
                                $location.path("/activity-details/" + $scope.task.ActivityId + "/");
                            }, function (error) {
                                $('#removeTaskDialog').modal('hide');
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：删除任务失败";
                            });
                }

            } ])
        .controller('TaskDetailsCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'ActivityService', 'TaskService',
                                        'Update4CommentTaskService', 'CommentListService', 'CommentService', 'userCache', 'dateUtil', 'taskServiceUtil',
            function ($scope, $location, $log, $routeParams, currentUser, ActivityService, TaskService,
                        Update4CommentTaskService, CommentListService, CommentService, userCache, dateUtil, taskServiceUtil) {

                $scope.isLoading = false;
                $scope.navbarLinkVisible = 'none';
                $scope.alertMessageVisible = 'hidden';
                $scope.comment = {};

                function render(comment, i) {
                    comment.index = (parseInt(i) + 1);
                    userCache.get(comment.Creator, function (e) {
                        comment.creatorName = (e == null) ? comment.Creator : e.Name;
                    });
                    if (comment.Creator == currentUser.getUsername()) {
                        comment.editCommentButtonVisible = '';
                    } else {
                        comment.editCommentButtonVisible = 'none';
                    }
                }

                $scope.init = function () {
                    TaskService.get({ 'user': currentUser.getUsername(), 'id': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.task = result;
                                if ($scope.task.Id === undefined) {
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：任务已被移除";
                                    return;
                                }
                                if ($scope.task.Staff == currentUser.getUsername()) {
                                    $scope.isExcuted = true;
                                } else {
                                    $scope.isExcuted = false;
                                }
                                userCache.get($scope.task.Staff, function (e) {
                                    $scope.task.staffName = (e == null) ? $scope.task.Staff : e.Name;
                                });
                                $scope.task.isOverdue = false;
                                if (!$scope.task.IsCompleted && $scope.task.AppointedDay !== undefined && $scope.task.AppointedDay !== null) {
                                    var d = new Date();
                                    var appointedDay = dateUtil.jsonToDate($scope.task.AppointedDay);
                                    appointedDay.setHours(23);
                                    appointedDay.setMinutes(59);
                                    appointedDay.setSeconds(59);
                                    if (d > appointedDay) {
                                        $scope.task.isOverdue = true;
                                    }
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载任务详细信息失败";
                            })
                            .then(function () {
                                if ($scope.task.ActivityId !== undefined && $scope.task.ActivityId !== null) {
                                    ActivityService.get({ 'user': currentUser.getUsername(), 'activityId': $scope.task.ActivityId })
                                        .$promise
                                            .then(function (result) {
                                                $scope.activity = result;
                                                userCache.get($scope.activity.Creator, function (e) {
                                                    $scope.activity.CreatorName = (e == null) ? $scope.activity.Creator : e.Name;
                                                });
                                                if ($scope.activity.Creator == currentUser.getUsername()) {
                                                    $scope.navbarLinkVisible = '';
                                                } else {
                                                    $scope.navbarLinkVisible = 'none';
                                                }
                                            }, function (error) {
                                                $scope.alertMessageVisible = 'show';
                                                $scope.alertMessage = "提示：加载活动详细信息失败";
                                                $log.error(error);
                                            });
                                }
                            });

                    CommentListService.query({ 'user': currentUser.getUsername(), 'commentTarget': 'task', 'targetId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.commentList = result;
                                for (var i in $scope.commentList) {
                                    var comment = $scope.commentList[i];
                                    render(comment, i);
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载评论列表失败";
                            });
                }

                $scope.deleteTask = function () {
                    TaskService.remove({ 'user': currentUser.getUsername(), 'id': $scope.task.Id })
                        .$promise
                            .then(function (result) {
                                $('#removeTaskDialog').modal('hide');
                                $location.path("/activity-details/" + $scope.task.ActivityId + "/");
                            }, function (error) {
                                $('#removeTaskDialog').modal('hide');
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：删除任务失败";
                            });
                }

                $scope.saveComment = function () {
                    if ($scope.comment.id == null || $scope.comment.id == '') {
                        var observers = [];
                        if ($scope.task.Staff == currentUser.getUsername()) {
                            observers.push($scope.activity.Creator);
                        } else {
                            observers.push($scope.task.Staff);
                        }
                        Update4CommentTaskService.save({ 'user': currentUser.getUsername(),
                            'id': $routeParams.id,
                            'content': $scope.comment.content,
                            'observers': observers
                        })
                        .$promise
                            .then(function (result) {
                                $scope.commentList.push(result);
                                render(result, $scope.commentList.length - 1);
                                $scope.clearComment();
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：保存评论失败";
                            });
                    } else {
                        CommentService.update({ 'user': currentUser.getUsername(),
                            'id': $scope.comment.id,
                            'content': $scope.comment.content
                        })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.commentList) {
                                    if ($scope.commentList[i].Id == result.Id) {
                                        $scope.commentList[i].Content = result.Content;
                                        break;
                                    }
                                }
                                $scope.clearComment();
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：修改评论失败";
                            });
                    }
                }


                $scope.clearComment = function () {
                    $scope.comment.id = '';
                    $scope.comment.content = '';
                }

                $scope.editComment = function (comment) {
                    document.getElementsByName('editCommentPanel')[0].scrollIntoView(true);
                    $scope.comment.id = comment.Id;
                    $scope.comment.content = comment.Content;
                }

                $scope.removeComment = function (comment) {
                    $scope.comment.id = comment.Id;
                    $scope.comment.content = comment.Content;
                }

                $scope.deleteComment = function () {
                    var observers = [];
                    if ($scope.task.Staff == currentUser.getUsername()) {
                        observers.push($scope.activity.Creator);
                    } else {
                        observers.push($scope.task.Staff);
                    }
                    Update4CommentTaskService.remove({ 'user': currentUser.getUsername(),
                        'id': $routeParams.id,
                        'commentId': $scope.comment.id,
                        'observers': observers
                    })
                        .$promise
                            .then(function (result) {
                                $('#removeCommentDialog').modal('hide');
                                for (var i in $scope.commentList) {
                                    if ($scope.comment.id == $scope.commentList[i].Id) {
                                        $scope.commentList.splice(i, 1);
                                        break;
                                    }
                                }
                                $scope.clearComment();
                            }, function (error) {
                                $('#removeCommentDialog').modal('hide');
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：删除评论失败";
                            });
                }

                $scope.startTask = function () {
                    taskServiceUtil.makeIsUnderway($scope.task, true);
                }

                $scope.pauseTask = function () {
                    taskServiceUtil.makeIsUnderway($scope.task, false);
                }

                $scope.stopTask = function () {
                    taskServiceUtil.makeIsCompleted($scope.task, true);
                }

                $scope.resumeTask = function () {
                    taskServiceUtil.makeIsCompleted($scope.task, false);
                }

            } ])
        .controller('TaskNotificationListCtrl', ['$scope', '$location', '$routeParams', '$log', 'currentUser', 'userCache', 'dateUtil',
                     'BizNotificationService4Resource', 'UntreatedBizNotificationService',
            function ($scope, $location, $routeParams, $log, currentUser, userCache, dateUtil,
                        BizNotificationService4Resource, UntreatedBizNotificationService) {

                function render(notification) {
                    userCache.get(notification.Sender, function (e) {
                        notification.senderName = (e == null) ? notification.Sender : e.Name;
                    });
                    userCache.get(notification.Receiver, function (e) {
                        notification.receiverName = (e == null) ? notification.Receiver : e.Name;
                    });
                    $scope.notificationList.push(notification);
                    if (notification.Review == null) {
                        notification.isUntreated = true;
                        notification.isUntreatedStatus = 'bold';
                    } else {
                        notification.isUntreated = false;
                        notification.isUntreatedStatus = 'normal';
                    }
                    if (currentUser.getUsername() == notification.Receiver && notification.isUntreated) {
                        notification.checkButtonVisible = '';
                    } else {
                        notification.checkButtonVisible = 'none';
                    }
                }

                $scope.init = function () {

                    $scope.alertMessageVisible = 'hidden';
                    $scope.taskId = $routeParams.id;

                    BizNotificationService4Resource.query({ 'user': currentUser.getUsername(), 'resource': 'task', 'resourceId': $scope.taskId })
                        .$promise
                            .then(function (result) {
                                $scope.alertMessageVisible = 'hidden';
                                $scope.notificationList = [];
                                var temp = new Date();
                                temp.setFullYear(1970, 0, 1);
                                var d = dateUtil.formatDateByYMD(temp);
                                for (var i = 0; i < result.length; i++) {
                                    var notification = result[i];
                                    var creation = dateUtil.formatDateByYMD(dateUtil.jsonToDate(notification.Creation));
                                    var addLabel = false;
                                    if (d != creation) {
                                        d = creation;
                                        addLabel = true;
                                    }
                                    notification.isLabel = false;
                                    if (addLabel) {
                                        $scope.notificationList.push({ 'isLabel': true, 'label': d });
                                    }
                                    render(notification);
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载任务通知集合失败";
                                $log.error(error);
                            });
                }

                $scope.check = function (notification) {
                    UntreatedBizNotificationService.update({ 'user': currentUser.getUsername(),
                        'notificationId': notification.Id
                    })
                        .$promise
                            .then(function (result) {
                                notification.Review = result.Review;
                                notification.isUntreated = false;
                                notification.isUntreatedStatus = 'normal';
                                notification.checkButtonVisible = 'none';
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：签收通知失败";
                            });
                }

            } ])
        .controller('ActivityTaskDelayCtrl', ['$scope', '$location', '$routeParams', '$log', 'currentUser', 'userCache',
                     'ActivityTaskDelayListService',
            function ($scope, $location, $routeParams, $log, currentUser, userCache,
                        ActivityTaskDelayListService) {

                $scope.init = function () {

                    $scope.alertMessageVisible = 'hidden';
                    $scope.timeStamp = new Date();
                    $scope.timeStamp = $scope.timeStamp.setDate($scope.timeStamp.getDate() - 1);

                    $scope.activityId = $routeParams.id;
                    ActivityTaskDelayListService.query({ 'activityId': $scope.activityId })
                        .$promise
                            .then(function (result) {
                                $scope.taskDelayList = result;
                                for (var i = 0; i < $scope.taskDelayList.length; i++) {
                                    var taskDelay = $scope.taskDelayList[i];
                                    userCache.get(taskDelay.Staff, function (e) {
                                        taskDelay.staffName = (e == null) ? taskDelay.Staff : e.Name;
                                    });
                                    taskDelay.delayPercent = taskDelay.Total <= 0 ? "0%" : (Math.round(taskDelay.Delay / taskDelay.Total * 10000) / 100.00 + "%");
                                    taskDelay.untimedPercent = taskDelay.Total <= 0 ? "0%" : (Math.round(taskDelay.Untimed / taskDelay.Total * 10000) / 100.00 + "%");
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：获取延误数据失败";
                            });

                }

            } ]);

});