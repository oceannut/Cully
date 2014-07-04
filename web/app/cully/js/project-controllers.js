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
                    $location.path('/project-activity-add/');
                }

            } ])
        .controller('ProjectListCtrl', ['$scope', '$location', 'currentUser', 'TopProjectService',
            function ($scope, $location, currentUser, TopProjectService) {

                $scope.init = function () {
                    TopProjectService.query({ 'user': currentUser.username, 'count': 10 })
                        .$promise
                            .then(function (result) {
                                $scope.projectList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.gotoDetails = function (id) {
                    $location.path('/project-details/' + id + "/");
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
                        $scope.alertMessageVisible = 'show';
                        $scope.alertMessage = "提示：成员列表加载失败";
                    }, function () {
                        $scope.isParticipantLoading = false;
                    });
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
        .controller('ProjectDetailsCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'ActivityService', 'ProjectDetailsService',
            function ($scope, $location, $log, $routeParams, currentUser, ActivityService, ProjectDetailsService) {

                $scope.addActivityBtnTitle = '添加活动';
                $scope.addActivityPanelDisplay = 'none';
                $scope.project = {};
                $scope.activity = {};
                $scope.isLoading = false;
                $scope.alertMessageVisible = 'hidden';

                function clear() {
                    $scope.activity.name = '';
                    $scope.activity.description = '';
                }

                $scope.init = function () {
                    ProjectDetailsService.get({ 'user': currentUser.username, 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.project = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                    ActivityService.query({ 'user': currentUser.username, 'projectId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.activityList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.toggleAddActivityPanelVisibible = function () {
                    if ($scope.addActivityPanelDisplay == 'none') {
                        $scope.addActivityBtnTitle = '取消';
                        $scope.addActivityPanelDisplay = '';
                    } else {
                        $scope.addActivityBtnTitle = '添加活动';
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
                            'category': $scope.activity.category,
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

            } ])
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
                                        $scope.activityList.push({ 'icon': category.Icon, 'isDate': false, 'name': item.Name, 'desc': item.Description, 'projectId': item.ProjectId, 'creation': item.Creation });
                                    }
                                }
                            }, function (error) {
                                $log.error(error);
                            });
                }

                $scope.gotoDetails = function (id) {
                    $location.path('/project-details/' + id + "/");
                }

            } ])
        .controller('ProjectActivityAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'ProjectActivityService', 'userCacheUtil', 'categoryCacheUtil',
            function ($scope, $location, $log, currentUser, ProjectActivityService, userCacheUtil, categoryCacheUtil) {

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
                        ProjectActivityService.save({
                            'user': currentUser.username,
                            'category': $scope.category.Code,
                            'name': $scope.activity.name,
                            'description': $scope.activity.description,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/project-details/' + result.ProjectId + '/');
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

            } ]);

});