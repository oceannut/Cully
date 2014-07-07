﻿'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('./project-services');
    require('../../common/js/user-services');
    require('../../common/js/category-services');

    angular.module('activity.controllers', ['configs', 'filters', 'project.services', 'user.services', 'category.services'])
        .controller('ActivityListCtrl', ['$scope', '$location', '$log', 'currentUser', 'dateUtil', 'ActivityListService', 'categoryCacheUtil',
            function ($scope, $location, $log, currentUser, dateUtil, ActivityListService, categoryCacheUtil) {

                $scope.init = function () {
                    ActivityListService.query({ 'user': currentUser.username, 'start': 0, 'count': 10 })
                        .$promise
                            .then(function (result) {
                                $scope.activityList = [];
                                if (result != null && result.length > 0) {
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
                                        $scope.activityList.push({ 'id': item.Id, 'icon': icon, 'isDate': false, 'name': item.Name, 'desc': item.Description, 'projectId': item.ProjectId, 'creation': item.Creation });
                                    }
                                }
                            }, function (error) {
                                $log.error(error);
                            });
                }

                $scope.gotoDetails = function (id) {
                    $location.path('/activity-details/' + id + "/");
                }

                $scope.gotoProject = function (id) {
                    $location.path('/project-details/' + id + "/");
                }

            } ])
        .controller('ActivityAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'SoloActivityService', 'userCacheUtil', 'categoryCacheUtil',
            function ($scope, $location, $log, currentUser, SoloActivityService, userCacheUtil, categoryCacheUtil) {

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
                        SoloActivityService.save({
                            'user': currentUser.username,
                            'category': $scope.category.Code,
                            'name': $scope.activity.name,
                            'description': $scope.activity.description,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/activity-details/' + result.ProjectId + '/');
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
        .controller('ActivityDetailsCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'ActivityDetailsService', 'categoryCacheUtil',
            function ($scope, $location, $log, $routeParams, currentUser, ActivityDetailsService, categoryCacheUtil) {

                $scope.alertMessageVisible = 'hidden';

                $scope.init = function () {
                    ActivityDetailsService.get({ 'user': currentUser.username, 'activityId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.activity = result;
                                var category = categoryCacheUtil.get('activity', $scope.activity.Category);
                                var icon = 'fa fa-tasks';
                                if (category != null) {
                                    $scope.activity.Icon = category.Icon;
                                }
                                $scope.taskListPage = 'partials/task-list-details.htm';
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