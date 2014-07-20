'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('./project-services');
    require('../../common/js/user-services');
    require('../../common/js/category-services');

    angular.module('activity.controllers', ['configs', 'filters', 'project.services', 'user.services', 'category.services'])
        .controller('ActivityListCtrl', ['$scope', '$location', '$log', 'currentUser', 'dateUtil', 'ActivityListService', 'categoryCacheUtil', 'userCacheUtil',
            function ($scope, $location, $log, currentUser, dateUtil, ActivityListService, categoryCacheUtil, userCacheUtil) {

                var pageSize = 20;

                function getActivityList() {
                    var startRowIndex = $scope.currentPage * pageSize;
                    var category = $scope.queryModel.category;
                    var date = $scope.queryModel.date;

                    if (category == '') {
                        category = 'null';
                    }
                    var startDay, span;
                    if (date != '') {
                        if (date == '-30') {
                            $scope.monthInputVisible = '';
                            if ($scope.queryModel.month != '') {
                                var array = $scope.queryModel.month.split('-');
                                var d = new Date(array[0], parseInt(array[1]) - 1, 1);
                                startDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                                span = dateUtil.getDaysofMonth(d.getMonth() + 1);
                            }
                        } else {
                            $scope.monthInputVisible = 'none';
                            startDay = dateUtil.getDate(date);
                            span = dateUtil.getSpan(date);
                        }

                    } else {
                        $scope.monthInputVisible = 'none';
                        startDay = 'null';
                        span = 'null';
                    }
                    if (startDay != undefined && span != undefined) {
                        //console.log(startDay);
                        //console.log(span);
                        ActivityListService.query3({ 'user': currentUser.username, 'category': category, 'date': startDay, 'span': span, 'start': startRowIndex, 'count': pageSize })
                            .$promise
                                .then(function (result) {
                                    interceptActivityList(result);
                                }, function (error) {
                                    $log.error(error);
                                });
                    }
                }

                function interceptActivityList(result) {
                    if (result != null && result.length > 0) {
                        $scope.activityList = [];
                        for (var i = 0; i < result.length; i++) {
                            var temp = new Date();
                            temp.setFullYear(1970, 0, 1);
                            var d = dateUtil.formatDateByYMD(temp);
                            for (var i = 0; i < result.length; i++) {
                                var item = result[i];
                                var creation = dateUtil.formatDateByYMD(dateUtil.jsonToDate(item.Creation));
                                if (d != creation) {
                                    d = creation;
                                    $scope.activityList.push({ 'isDate': true, 'date': d });
                                }
                                var category = categoryCacheUtil.get('activity', item.Category);
                                var icon = 'fa fa-tasks';
                                if (category != null) {
                                    icon = category.Icon;
                                }
                                var user = userCacheUtil.get(item.Creator);
                                item.creatorName = (user == null) ? item.Creator : user.Name;
                                $scope.activityList.push({
                                    'id': item.Id,
                                    'icon': icon,
                                    'isDate': false,
                                    'name': item.Name,
                                    'desc': item.Description,
                                    'projectId': item.ProjectId,
                                    'creator': item.creatorName,
                                    'creation': item.Creation
                                });
                            }
                        }
                        $scope.nextBtnClass = '';
                    } else {
                        if ($scope.currentPage > 0) {
                            $scope.currentPage--;
                        } else {
                            $scope.activityList = [];
                        }
                        $scope.nextBtnClass = 'disabled';
                    }
                    if ($scope.currentPage == 0) {
                        $scope.prevBtnClass = 'disabled';
                    } else {
                        $scope.prevBtnClass = '';
                    }
                }

                $scope.init = function () {
                    $scope.monthInputVisible = 'none';
                    $scope.queryModel = {
                        'category': '',
                        'date': '',
                        'month': ''
                    }
                    $scope.prevBtnClass = 'disabled';
                    $scope.nextBtnClass = '';
                    $scope.currentPage = -1;

                    categoryCacheUtil.list('activity', function (result) {
                        $scope.categoryList = result;
                    });
                    $scope.query();
                }

                $scope.query = function () {
                    $scope.currentPage = 0;
                    getActivityList();
                }

                $scope.prevPage = function () {
                    if ($scope.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                        getActivityList();
                    }
                }

                $scope.nextPage = function () {
                    if ($scope.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.currentPage++;
                    getActivityList();
                }

                $scope.gotoDetails = function (id) {
                    $location.path('/activity-details/' + id + "/");
                }

                $scope.gotoProject = function (id) {
                    $location.path('/project-details/' + id + "/");
                }

            } ])
        .controller('ActivityAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'ActivityService', 'userCacheUtil', 'categoryCacheUtil',
            function ($scope, $location, $log, currentUser, ActivityService, userCacheUtil, categoryCacheUtil) {

                $scope.activity = {};
                $scope.participants = [];
                $scope.isParticipantLoading = false;
                $scope.isLoading = false;
                $scope.alertMessageVisible = 'hidden';

                $scope.init = function () {
                    $scope.isParticipantLoading = true;

                    $scope.users = [];
                    userCacheUtil.list(function (result) {
                        if (result != null) {
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].Username != currentUser.username) {
                                    $scope.users.push(result[i]);
                                }
                            }
                        }
                    }, function (error) {
                        $scope.alertMessageVisible = 'show';
                        $scope.alertMessage = "提示：成员列表加载失败";
                    }, function () {
                        $scope.isParticipantLoading = false;
                    });

                    categoryCacheUtil.list('activity', function (result) {
                        $scope.categoryList = result;
                    });
                    $scope.category = categoryCacheUtil.get('activity', 'normal');

                }

                $scope.gotoback = function () {
                    history.back();
                }

                $scope.selectCategory = function (selectedCategory) {
                    $scope.category = selectedCategory;
                }

                $scope.addParticipant = function (user) {
                    if ($scope.participants.indexOf(user) == -1) {
                        $scope.participants.push(user);
                    }
                }

                $scope.addAllParticipant = function () {
                    $scope.participants = [];
                    if ($scope.allParticipantChecked) {
                        for (var i = 0; i < $scope.users.length; i++) {
                            $scope.participants.push($scope.users[i]);
                        }
                    }
                }

                $scope.removeParticipant = function (user) {
                    var i = $scope.participants.indexOf(user);
                    if (i > -1) {
                        $scope.participants.splice(i, 1);
                    }
                }

                $scope.save = function () {
                    if ($scope.activity.name != undefined && $scope.activity.name != null) {
                        var usernameArray = [];
                        for (var i = 0; i < $scope.participants.length; i++) {
                            usernameArray.push($scope.participants[i].Username);
                        }
                        $scope.isLoading = true;
                        ActivityService.saveSolo({
                            'user': currentUser.username,
                            'category': $scope.category.Code,
                            'name': $scope.activity.name,
                            'description': $scope.activity.description,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/activity-details/' + result.Id + '/');
                            }, function (error) {
                                $scope.isLoading = false;
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：添加活动失败";
                                $log.error(error);
                            });
                    }
                }

                $scope.cancel = function () {
                    history.back();
                }

            } ])
        .controller('ActivityDetailsCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'ActivityService', 'categoryCacheUtil', 'userCacheUtil',
            function ($scope, $location, $log, $routeParams, currentUser, ActivityService, categoryCacheUtil, userCacheUtil) {

                $scope.alertMessageVisible = 'hidden';

                $scope.init = function () {
                    ActivityService.get({ 'user': currentUser.username, 'activityId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.activity = result;
                                var category = categoryCacheUtil.get('activity', $scope.activity.Category);
                                var icon = 'fa fa-tasks';
                                if (category != null) {
                                    $scope.activity.Icon = category.Icon;
                                }
                                var user = userCacheUtil.get($scope.activity.Creator);
                                $scope.activity.creatorName = (user == null) ? $scope.activity.Creator : user.Name;
                                $scope.taskListPage = 'partials/task-list.htm';
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载活动详细信息失败";
                                $log.error(error);
                            });

                }

                $scope.gotoProject = function (projectId) {
                    $location.path('/project-details/' + projectId + "/");
                }

            } ]);

});