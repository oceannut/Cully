'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./project-services');
    require('../../auth/js/auth-models');
    require('../../auth/js/auth-directives');
    require('../../common/js/common-cache');
    require('../../common/js/common-utils');

    angular.module('project.controllers', ['configs', 'filters', 'project.services', 'auth.models', 'auth.directives', 'common.cache', 'common.utils'])
        .controller('ProjectSummaryCtrl', ['$scope', function ($scope) {

            $scope.init = function () {

            }

        } ])
        .controller('ProjectListCtrl', ['$scope', '$log', 'currentUser', 'TopProjectListService', 'ProjectListService', 'dateUtil',
            function ($scope, $log, currentUser, TopProjectListService, ProjectListService, dateUtil) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    $scope.queryModel = {
                        'month': '',
                        'isSoloInclude': false
                    }
                    TopProjectListService.query({ 'user': currentUser.getUsername(), 'isSoloInclude': $scope.queryModel.isSoloInclude, 'count': 10 })
                        .$promise
                            .then(function (result) {
                                $scope.projectList = result;
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：项目列表加载失败";
                            });
                }

                $scope.query = function () {
                    $scope.alertMessageVisible = 'hidden';
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
                        ProjectListService.query({ 'user': currentUser.getUsername(), 'isSoloInclude': $scope.queryModel.isSoloInclude, 'date': startDay, 'span': span, 'start': 0, 'count': 1000 })
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
        .controller('ProjectAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'ProjectService', 'userCache', 'categoryCache', 'listUtil', 'CategoryHelper',
            function ($scope, $location, $log, currentUser, ProjectService, userCache, categoryCache, listUtil, CategoryHelper) {

                var defaultCategory = null;

                $scope.init = function () {

                    $scope.project = {};
                    $scope.users = [];
                    $scope.participants = [];
                    $scope.createSameNameActivity = false;
                    $scope.isLoading = false;
                    $scope.alertMessageVisible = 'hidden';

                    userCache.list(function (result) {
                        listUtil.shallowCopyList($scope.users, result, false, function (e) {
                            return (e.Username !== currentUser.getUsername() & e.Roles.indexOf('user') > -1);
                        });
                    });
                    categoryCache.list('activity', function (result) {
                        CategoryHelper.selectCategory(result, 'normal', function (e) {
                            defaultCategory = e;
                        });
                    });
                }

                $scope.addParticipant = function (user) {
                    listUtil.add($scope.participants, user);
                }

                $scope.removeParticipant = function (user) {
                    listUtil.remove($scope.participants, user);
                }

                $scope.checkOrNotAllParticipant = function () {
                    if ($scope.allParticipantChecked) {
                        listUtil.shallowCopyList($scope.participants, $scope.users);
                    } else {
                        $scope.participants.length = 0;
                    }
                }

                $scope.save = function () {
                    if ($scope.project.name != undefined && $scope.project.name != null) {
                        var usernameArray = [];
                        for (var i = 0; i < $scope.participants.length; i++) {
                            usernameArray.push($scope.participants[i].Username);
                        }
                        $scope.alertMessageVisible = 'hidden';
                        $scope.isLoading = true;

                        var category = null;
                        if ($scope.createSameNameActivity) {
                            category = defaultCategory.Code;
                        }
                        ProjectService.save({
                            'user': currentUser.getUsername(),
                            'name': $scope.project.name,
                            'description': $scope.project.description,
                            'participants': usernameArray,
                            'createSameNameActivity': $scope.createSameNameActivity,
                            'category': category
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/project-details/' + result.Id + "/");
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：添加项目失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

            } ])
        .controller('ProjectEditCtrl', ['$scope', '$routeParams', '$log', 'currentUser', 'ProjectService',
            function ($scope, $routeParams, $log, currentUser, ProjectService) {

                $scope.init = function () {
                    $scope.isLoading = false;
                    $scope.alertMessageVisible = 'hidden';
                    ProjectService.get({ 'user': currentUser.getUsername(), 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.project = result;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：加载项目详细信息失败";
                                $log.error(error);
                            });
                }

                $scope.save = function () {
                    if ($scope.project.Name != null) {
                        $scope.isLoading = true;
                        $scope.alertMessageVisible = 'hidden';
                        ProjectService.update({
                            'user': currentUser.getUsername(),
                            'projectId': $scope.project.Id,
                            'name': $scope.project.Name,
                            'description': $scope.project.Description
                        })
                        .$promise
                            .then(function (result) {
                                $scope.project = result;
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-success';
                                $scope.alertMessage = "提示：修改项目成功";
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：修改项目失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

            } ])
        .controller('ProjectDetailsCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'ProjectService',
                                            'ActivityService', 'ActivityOfProjectService', 'categoryCache', 'userCache', 'CategoryHelper',
            function ($scope, $log, $routeParams, currentUser, ProjectService,
                        ActivityService, ActivityOfProjectService, categoryCache, userCache, CategoryHelper) {

                function clear() {
                    $scope.activity.name = '';
                    $scope.activity.description = '';
                }

                function renderActivity(activity) {
                    categoryCache.get('activity', activity.Category, function (e) {
                        var icon = 'fa fa-tasks';
                        if (e != null) {
                            activity.icon = e.Icon;
                        }
                    });
                    userCache.get(activity.Creator, function (e) {
                        activity.creatorName = (e == null) ? activity.Creator : e.Name;
                    });
                }

                function loadActivityList() {
                    ActivityOfProjectService.query({ 'user': currentUser.getUsername(), 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.activityList = result;
                                for (var i = 0; i < $scope.activityList.length; i++) {
                                    var activity = $scope.activityList[i];
                                    activity.index = (i + 1);
                                    renderActivity(activity);
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载活动列表失败";
                                $log.error(error);
                            });
                }

                $scope.init = function () {

                    $scope.addActivityPanelDisplay = 'none';
                    $scope.project = {};
                    $scope.activity = {};
                    $scope.isLoading = false;
                    $scope.alertMessageVisible = 'hidden';

                    ProjectService.get({ 'user': currentUser.getUsername(), 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.project = result;
                                if (currentUser.getUsername() === $scope.project.Creator) {
                                    $scope.isEditable = true;
                                } else {
                                    $scope.isEditable = false;
                                }
                                userCache.get($scope.project.Creator, function (e) {
                                    $scope.project.creatorName = (e == null) ? $scope.project.Creator : e.Name;
                                });
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载项目详细信息失败";
                                $log.error(error);
                            });

                    loadActivityList();

                    categoryCache.list('activity', function (result) {
                        $scope.categoryList = result;
                        CategoryHelper.selectCategory($scope.categoryList, 'normal', function (e) {
                            $scope.category = e;
                        });
                    });
                }

                $scope.selectCategory = function (selectedCategory) {
                    CategoryHelper.selectCategory($scope.categoryList, selectedCategory.Code, function (e) {
                        $scope.category = e;
                    });
                }

                $scope.toggleAddActivityPanelVisibible = function () {
                    if ($scope.addActivityPanelDisplay == 'none') {
                        $scope.addActivityPanelDisplay = '';
                    } else {
                        $scope.addActivityPanelDisplay = 'none';
                        clear();
                    }
                }

                $scope.refreshActivityList = function () {
                    loadActivityList();
                }

                $scope.saveActivity = function () {
                    if ($scope.activity.name != undefined && $scope.activity.name != null) {
                        $scope.isLoading = true;
                        ActivityService.save({
                            'user': currentUser.getUsername(),
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
                                renderActivity(result);
                                for (var i = 0; i < $scope.activityList.length; i++) {
                                    var activity = $scope.activityList[i];
                                    activity.index = (i + 1);
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：添加活动失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

                $scope.cancel = function () {
                    $scope.toggleAddActivityPanelVisibible();
                }

            } ]);

});