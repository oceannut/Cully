'use strict';

define(function (require) {

    require('bootstrap');
    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./project-services');
    require('./task-services');
    require('./comment-services');

    angular.module('task.controllers', ['configs', 'filters', 'project.services', 'task.services', 'comment.services'])
        .controller('TaskListCtrl', ['$scope', '$location', '$log', 'currentUser', 'TaskService', 'TaskListService', 'Update4IsUnderwayTaskService',
                                 'Update4IsCompletedTaskService', 'ParticipantOfProjectService', 'userCacheUtil', 'dateUtil',
            function ($scope, $location, $log, currentUser, TaskService, TaskListService, Update4IsUnderwayTaskService,
                      Update4IsCompletedTaskService, ParticipantOfProjectService, userCacheUtil, dateUtil) {

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
                    var user = userCacheUtil.get(task.Staff);
                    task.staffName = (user == null) ? task.Staff : user.Name;
                }

                function renderTask(task) {
                    var parentScope = $scope.$parent.$parent;
                    if (currentUser.username == parentScope.activity.Creator) {
                        task.editButtonDisabled = false;
                    } else {
                        task.editButtonDisabled = true;
                    }
                    if (currentUser.username == task.Staff) {
                        task.changeIsUnderwayButtonVisible = '';
                        task.completeButtonDisabled = false;
                    } else {
                        task.changeIsUnderwayButtonVisible = 'none';
                        task.completeButtonDisabled = true;
                    }
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
                    ParticipantOfProjectService.query({ 'user': currentUser.username, 'projectId': parentScope.activity.ProjectId })
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
                    TaskListService.query({ 'user': currentUser.username, 'activityId': parentScope.activity.Id })
                        .$promise
                            .then(function (result) {
                                $scope.rawTaskList = [];
                                $scope.rawCompletedTaskList = [];
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
                        TaskService.update({ 'user': currentUser.username, 'activityId': parentScope.activity.Id, 'id': $scope.task.id, 'staff': $scope.task.staff, 'content': $scope.task.content, 'appointedDay': $scope.task.appointedDay })
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
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：任务状态修改失败";
                            });
                }

                $scope.gotoTask = function (task) {
                    $location.path('/task-details/' + task.ActivityId + '/' + task.Id + '/');
                }

            } ])
        .controller('TaskEditCtrl', ['$scope', '$location', '$routeParams', '$log', 'currentUser', 'TaskService', 'userCacheUtil',
            function ($scope, $location, $routeParams, $log, currentUser, TaskService, userCacheUtil) {

                $scope.isLoading = false;
                $scope.alertMessageVisible = 'hidden';

                $scope.init = function () {
                    TaskService.get({ 'user': currentUser.username, 'activityId': $routeParams.activityId, 'id': $routeParams.id })
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

                $scope.gotoback = function () {
                    $location.path("/task-details/" + $scope.task.ActivityId + "/" + $scope.task.Id + "/");
                }

                $scope.save = function () {
                    if ($scope.project.Name != null) {
                        $scope.isLoading = true;
                        //                        TaskService.update({
                        //                            'user': currentUser.username,
                        //                            'projectId': $scope.project.Id,
                        //                            'name': $scope.project.Name,
                        //                            'description': $scope.project.Description
                        //                        })
                        //                        .$promise
                        //                            .then(function (result) {
                        //                                $scope.isLoading = false;
                        //                                $scope.project = result;
                        //                                $scope.alertMessageVisible = 'show';
                        //                                $scope.alertMessageColor = 'alert-success';
                        //                                $scope.alertMessage = "提示：修改任务成功";
                        //                            }, function (error) {
                        //                                $scope.isLoading = false;
                        //                                $scope.alertMessageVisible = 'show';
                        //                                $scope.alertMessageColor = 'alert-danger';
                        //                                $scope.alertMessage = "提示：修改任务失败";
                        //                                $log.error(error);
                        //                            });
                    }
                }

            } ])
        .controller('TaskDetailsCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'ActivityService', 'TaskService',
                                        'Update4CommentTaskService', 'CommentListService', 'CommentService', 'userCacheUtil', 'dateUtil',
            function ($scope, $location, $log, $routeParams, currentUser, ActivityService, TaskService,
                        Update4CommentTaskService, CommentListService, CommentService, userCacheUtil, dateUtil) {

                $scope.isLoading = false;
                $scope.navbarLinkVisible = 'none';
                $scope.alertMessageVisible = 'hidden';
                $scope.comment = {};

                function render(comment, i) {
                    comment.index = (parseInt(i) + 1);
                    var user = userCacheUtil.get(comment.Creator);
                    comment.creatorName = (user == null) ? comment.Creator : user.Name;
                    if (comment.Creator == currentUser.username) {
                        comment.editCommentButtonVisible = '';
                    } else {
                        comment.editCommentButtonVisible = 'none';
                    }
                }

                $scope.init = function () {
                    ActivityService.get({ 'user': currentUser.username, 'activityId': $routeParams.activityId })
                        .$promise
                            .then(function (result) {
                                $scope.activity = result;
                                var user = userCacheUtil.get($scope.activity.Creator);
                                $scope.activity.CreatorName = (user == null) ? $scope.activity.Creator : user.Name;
                                if ($scope.activity.Creator == currentUser.username) {
                                    $scope.navbarLinkVisible = '';
                                } else {
                                    $scope.navbarLinkVisible = 'none';
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载活动详细信息失败";
                                $log.error(error);
                            });

                    TaskService.get({ 'user': currentUser.username, 'activityId': $routeParams.activityId, 'id': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.task = result;
                                var user = userCacheUtil.get($scope.task.Staff);
                                $scope.task.staffName = (user == null) ? $scope.task.Staff : user.Name;
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载任务详细信息失败";
                            });
                    CommentListService.query({ 'user': currentUser.username, 'commentTarget': 'task', 'targetId': $routeParams.id })
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

                $scope.gotoActivity = function (id) {
                    $location.path("/activity-details/" + id + "/");
                }

                $scope.gotoTaskEdit = function (task) {
                    $location.path("/task-edit/" + task.ActivityId + "/" + task.Id + "/");
                }

                $scope.saveComment = function () {
                    if ($scope.comment.id == null || $scope.comment.id == '') {
                        var observers = [];
                        if ($scope.task.Staff == currentUser.username) {
                            observers.push($scope.activity.Creator);
                        } else {
                            observers.push($scope.task.Staff);
                        }
                        Update4CommentTaskService.save({ 'user': currentUser.username,
                            'activityId': $routeParams.activityId,
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
                        CommentService.update({ 'user': currentUser.username,
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
                    if ($scope.task.Staff == currentUser.username) {
                        observers.push($scope.activity.Creator);
                    } else {
                        observers.push($scope.task.Staff);
                    }
                    Update4CommentTaskService.remove({ 'user': currentUser.username,
                        'activityId': $routeParams.activityId,
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

            } ]);

});