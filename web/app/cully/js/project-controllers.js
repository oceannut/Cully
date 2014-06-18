'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('./project-services');
    require('../../common/js/user-services');

    angular.module('project.controllers', ['configs', 'filters', 'project.services', 'user.services'])
        .controller('ProjectSummaryCtrl', ['$scope', '$location', 'currentUser',
            function ($scope, $location, currentUser) {

                $scope.createProject = function () {
                    console.log("createProject");
                    $location.path('/project-add/');
                }

                $scope.createActivity = function () {
                    console.log("createActivity");
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
        .controller('ProjectAddCtrl', ['$scope', '$location', 'currentUser', 'ProjectService', 'UserListService',
            function ($scope, $location, currentUser, ProjectService, UserListService) {

                $scope.project = {};
                $scope.participants = [];

                $scope.init = function () {
                    UserListService.query()
                        .$promise
                            .then(function (result) {
                                if (result != null) {
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].Username == currentUser.username) {
                                            result.splice(i, 1);
                                        }
                                    }
                                    $scope.users = result;
                                }
                            }, function (error) {
                                console.log("error: " + error);
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
                    var usernameArray = [];
                    for (var i = 0; i < $scope.participants.length; i++) {
                        usernameArray.push($scope.participants[i].Username);
                    }
                    ProjectService.save({
                        'user': currentUser.username,
                        'name': $scope.project.name,
                        'description': $scope.project.description,
                        'participants': usernameArray
                    })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                                $location.path('/project-details/' + result.Id + "/");
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.cancel = function () {
                    console.log("cancel");
                    $location.path('/project-list/');
                }

            } ])
        .controller('ProjectDetailsCtrl', ['$scope', '$location', '$routeParams', 'currentUser', 'ActivityService', 'ProjectDetailsService',
            function ($scope, $location, $routeParams, currentUser, ActivityService, ProjectDetailsService) {

                $scope.addActivityBtnTitle = '添加活动';
                $scope.addActivityPanelDisplay = 'none';
                $scope.project = {};
                $scope.activity = {};

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
                    ActivityService.save({
                        'user': currentUser.username,
                        'projectId': $routeParams.id,
                        'name': $scope.activity.name,
                        'description': $scope.activity.description
                    })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                                clear();
                                $scope.toggleAddActivityPanelVisibible();
                                $scope.activityList.unshift(result);
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

            } ])
        .controller('ActivityListCtrl', ['$scope', '$location', 'currentUser', 'ActivityListService',
            function ($scope, $location, currentUser, ActivityListService) {

                $scope.init = function () {
                    ActivityListService.query({ 'user': currentUser.username, 'start': 0, 'count': 10 })
                        .$promise
                            .then(function (result) {
                                $scope.activityList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.gotoDetails = function (id) {
                    $location.path('/project-details/' + id + "/");
                }

            } ])
        .controller('ProjectActivityAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'ProjectActivityService', 'UserListService',
            function ($scope, $location, $log, currentUser, ProjectActivityService, UserListService) {

                $scope.activity = {};
                $scope.participants = [];
                $scope.alertMessageVisible = 'hidden';

                $scope.init = function () {
                    UserListService.query()
                        .$promise
                            .then(function (result) {
                                if (result != null) {
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].Username == currentUser.username) {
                                            result.splice(i, 1);
                                        }
                                    }
                                    $scope.users = result;
                                }
                            }, function (error) {
                                $log.error(error);
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
                    if ($scope.activity.name != undefined && $scope.activity.name != null) {
                        var usernameArray = [];
                        for (var i = 0; i < $scope.participants.length; i++) {
                            usernameArray.push($scope.participants[i].Username);
                        }
                        ProjectActivityService.save({
                            'user': currentUser.username,
                            'name': $scope.activity.name,
                            'description': $scope.activity.description,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/project-details/' + result.ProjectId + '/');
                            }, function (error) {
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