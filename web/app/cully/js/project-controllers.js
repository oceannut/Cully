'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('./project-services');
    require('../../common/js/user-services');
    require('../../common/js/category-services');

    angular.module('project.controllers', ['configs', 'filters', 'project.services', 'user.services', 'category.services'])
        .controller('ProjectSummaryCtrl', ['$scope', '$location', 'currentUser',
            function ($scope, $location, currentUser) {

                $scope.createProject = function () {
                    $location.path('/project-add/');
                }

                $scope.createActivity = function () {
                    $location.path('/activity-add/');
                }

            } ])
        .controller('ProjectListCtrl', ['$scope', '$location', '$log', 'currentUser', 'TopProjectListService', 'ProjectListService', 'dateUtil',
            function ($scope, $location, $log, currentUser, TopProjectListService, ProjectListService, dateUtil) {

                $scope.init = function () {
                    $scope.queryModel = {
                        'month': '',
                        'isSoloInclude': false
                    }
                    TopProjectListService.query({ 'user': currentUser.username, 'isSoloInclude': $scope.queryModel.isSoloInclude, 'count': 10 })
                        .$promise
                            .then(function (result) {
                                $scope.projectList = result;
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：项目列表加载失败";
                            });
                }

                $scope.gotoDetails = function (id) {
                    $location.path('/project-details/' + id + "/");
                }

                $scope.query = function () {
                    var startDay, span, d;
                    if ($scope.queryModel.month != '') {
                        var array = $scope.queryModel.month.split('-');
                        d = new Date(array[0], parseInt(array[1]) - 1, 1);
                    } else {
                        var temp = new Date();
                        d = new Date(temp.getFullYear(), temp.getMonth(), 1);
                    }
                    startDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                    span = dateUtil.getDaysofMonth(d.getMonth() + 1);
                    if (startDay != undefined && span != undefined) {
                        ProjectListService.query({ 'user': currentUser.username, 'isSoloInclude': $scope.queryModel.isSoloInclude, 'date': startDay, 'span': span, 'start': 0, 'count': 1000 })
                            .$promise
                                .then(function (result) {
                                    $scope.projectList = result;
                                }, function (error) {
                                    $log.error(error);
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：项目列表加载失败";
                                });
                    }
                }

            } ])
        .controller('ProjectAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'ProjectService', 'userCacheUtil',
            function ($scope, $location, $log, currentUser, ProjectService, userCacheUtil) {

                $scope.project = {};
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
                        $log.error(error);
                        $scope.alertMessageVisible = 'show';
                        $scope.alertMessage = "提示：成员列表加载失败";
                    }, function () {
                        $scope.isParticipantLoading = false;
                    });
                }

                $scope.gotoback = function () {
                    history.back();
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
                    if ($scope.project.name != undefined && $scope.project.name != null) {
                        var usernameArray = [];
                        for (var i = 0; i < $scope.participants.length; i++) {
                            usernameArray.push($scope.participants[i].Username);
                        }
                        $scope.isLoading = true;
                        ProjectService.save({
                            'user': currentUser.username,
                            'name': $scope.project.name,
                            'description': $scope.project.description,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/project-details/' + result.Id + "/");
                            }, function (error) {
                                $scope.isLoading = false;
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：添加项目失败";
                                $log.error(error);
                            });
                    }
                }

                $scope.cancel = function () {
                    history.back();
                }

            } ])
        .controller('ProjectEditCtrl', ['$scope', '$location', '$routeParams', '$log', 'currentUser', 'ProjectService', 'userCacheUtil',
            function ($scope, $location, $routeParams, $log, currentUser, ProjectService, userCacheUtil) {

                $scope.isLoading = false;
                $scope.alertMessageVisible = 'hidden';

                $scope.init = function () {
                    ProjectService.get({ 'user': currentUser.username, 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.project = result;
                                $scope.alertMessageVisible = 'hidden';
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：加载项目详细信息失败";
                                $log.error(error);
                            });
                }

                $scope.gotoback = function () {
                    $location.path("/project-details/" + $scope.project.Id + "/");
                }

                $scope.save = function () {
                    if ($scope.project.Name != null) {
                        $scope.isLoading = true;
                        ProjectService.update({
                            'user': currentUser.username,
                            'projectId': $scope.project.Id,
                            'name': $scope.project.Name,
                            'description': $scope.project.Description
                        })
                        .$promise
                            .then(function (result) {
                                $scope.isLoading = false;
                                $scope.project = result;
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-success';
                                $scope.alertMessage = "提示：修改项目成功";
                            }, function (error) {
                                $scope.isLoading = false;
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：修改项目失败";
                                $log.error(error);
                            });
                    }
                }

            } ])
        .controller('ProjectDetailsCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'ProjectService',
                                            'ActivityService', 'ActivityOfProjectService', 'categoryCacheUtil', 'userCacheUtil',
            function ($scope, $location, $log, $routeParams, currentUser, ProjectService,
                        ActivityService, ActivityOfProjectService, categoryCacheUtil, userCacheUtil) {

                $scope.navbarLinkVisible = 'none';
                $scope.addActivityPanelDisplay = 'none';
                $scope.project = {};
                $scope.activity = {};
                $scope.isLoading = false;
                $scope.alertMessageVisible = 'hidden';

                function clear() {
                    $scope.activity.name = '';
                    $scope.activity.description = '';
                }

                $scope.gotoProjectEdit = function (projectId) {
                    $location.path("/project-edit/" + projectId + "/");
                }

                $scope.gotoPariticipantList = function (projectId) {
                    $location.path("/participant-list/" + projectId + "/");
                }

                $scope.init = function () {
                    ProjectService.get({ 'user': currentUser.username, 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.project = result;
                                if (currentUser.username == $scope.project.Creator) {
                                    $scope.navbarLinkVisible = '';
                                } else {
                                    $scope.navbarLinkVisible = 'none';
                                }
                                var user = userCacheUtil.get($scope.project.Creator);
                                $scope.project.creatorName = (user == null) ? $scope.project.Creator : user.Name;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载项目详细信息失败";
                                $log.error(error);
                            });
                    ActivityOfProjectService.query({ 'user': currentUser.username, 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.activityList = result;
                                for (var i = 0; i < $scope.activityList.length; i++) {
                                    var activity = $scope.activityList[i];
                                    activity.index = (i + 1);
                                    var category = categoryCacheUtil.get('activity', activity.Category);
                                    var icon = 'fa fa-tasks';
                                    if (category != null) {
                                        activity.icon = category.Icon;
                                    }
                                    var user = userCacheUtil.get(activity.Creator);
                                    activity.creatorName = (user == null) ? activity.Creator : user.Name;
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载活动列表失败";
                                $log.error(error);
                            });

                    categoryCacheUtil.list('activity', function (result) {
                        $scope.categoryList = result;
                    });
                    $scope.category = categoryCacheUtil.get('activity', 'normal');
                }

                $scope.gotoActivity = function (activityId) {
                    $location.path('/activity-details/' + activityId + "/");
                }

                $scope.selectCategory = function (selectedCategory) {
                    $scope.category = selectedCategory;
                }

                $scope.toggleAddActivityPanelVisibible = function () {
                    if ($scope.addActivityPanelDisplay == 'none') {
                        $scope.addActivityPanelDisplay = '';
                    } else {
                        $scope.addActivityPanelDisplay = 'none';
                        clear();
                    }
                }

                $scope.saveActivity = function () {
                    if ($scope.activity.name != undefined && $scope.activity.name != null) {
                        $scope.isLoading = true;
                        ActivityService.save({
                            'user': currentUser.username,
                            'projectId': $routeParams.id,
                            'category': $scope.category.Code,
                            'name': $scope.activity.name,
                            'description': $scope.activity.description
                        })
                        .$promise
                            .then(function (result) {
                                clear();
                                $scope.toggleAddActivityPanelVisibible();
                                $scope.activityList.unshift(result);
                            }, function (error) {
                                $scope.isLoading = false;
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：添加活动失败";
                                $log.error(error);
                            });
                    }
                }

                $scope.cancel = function () {
                    $scope.toggleAddActivityPanelVisibible();
                }

            } ]);

});