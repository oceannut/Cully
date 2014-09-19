'use strict';

define(function (require) {

    require('ng');

    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('../../auth/js/auth-models');
    require('../../auth/js/auth-directives');
    require('../../common/js/common-cache');
    require('../../common/js/common-utils');
    require('./client-services');
    require('./project-services');
    require('./cully-constants');

    angular.module('project.controllers', ['configs', 'filters', 'auth.models', 'auth.directives', 'common.cache', 'face.cache',
                                            'common.utils', 'client.services', 'project.services', 'cully.constants'])
        .controller('ProjectSummaryCtrl', ['$scope', function ($scope) {

            $scope.init = function () {

            }

        } ])
        .controller('ProjectListCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'dateUtil', 'commonUtil', 'localStorageUtil',
                                        'projectFace', 'faceCache', 'TopProjectListService', 'ProjectListService',
            function ($scope, $log, $routeParams, currentUser, dateUtil, commonUtil, localStorageUtil,
                        projectFace, faceCache, TopProjectListService, ProjectListService) {

                function renderList(list) {
                    if (list != null && list.length > 0) {
                        var len = list.length;
                        for (var i = 0; i < len; i++) {
                            commonUtil.buildCreatorName(list[i]);
                            $scope.events.projectList.push(list[i]);
                        }
                    }
                }

                $scope.init = function () {
                    var reload = $routeParams.reload;
                    $scope.events = {
                        isLoading: false,
                        alertMessage: '',
                        projectList: []
                    };
                    if (reload === 'true') {
                        $scope.faceModel = {
                            month: '',
                            isSoloInclude: false
                        };
                        var topCount = localStorageUtil.getUserData(currentUser.getUsername(), localStorageUtil.pageSize, localStorageUtil.pageSizeDV, true);
                        $scope.events.isLoading = true;
                        TopProjectListService.query({
                            'user': currentUser.getUsername(),
                            'isSoloInclude': $scope.faceModel.isSoloInclude,
                            'count': topCount
                        })
                        .$promise
                            .then(function (result) {
                                faceCache.setModel(projectFace, $scope.faceModel);
                                faceCache.init(projectFace, result);
                                renderList(result);
                            }, function (error) {
                                $log.error(error);
                                $scope.events.alertMessage = "提示：项目列表加载失败";
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    } else {
                        $scope.faceModel = faceCache.getModel(projectFace);
                        faceCache.pull(projectFace, $scope.events.projectList);
                    }
                }

                $scope.query = function () {
                    $scope.events.projectList.length = 0;
                    var startDay, span, d;
                    if ($scope.faceModel.month != '') {
                        var array = $scope.faceModel.month.split('-');
                        d = new Date(array[0], parseInt(array[1]) - 1, 1);
                    } else {
                        var temp = new Date();
                        d = new Date(temp.getFullYear(), temp.getMonth(), 1);
                    }
                    startDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                    span = dateUtil.getDaysofMonth(d.getMonth() + 1);
                    if (startDay != undefined && span != undefined) {
                        $scope.events.alertMessage = "";
                        $scope.events.isLoading = true;
                        ProjectListService.query({
                            'user': currentUser.getUsername(),
                            'isSoloInclude': $scope.faceModel.isSoloInclude,
                            'date': startDay,
                            'span': span,
                            'start': 0,
                            'count': 1000
                        })
                        .$promise
                            .then(function (result) {
                                faceCache.setModel(projectFace, $scope.faceModel);
                                faceCache.init(projectFace, result);
                                renderList(result);
                            }, function (error) {
                                $log.error(error);
                                $scope.events.alertMessage = "提示：项目列表加载失败";
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    }
                }

            } ])
        .controller('ProjectAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'listUtil', 'commonUtil', 'categoryCache',
                                        'projectFace', 'faceCache', 'ProjectService',
            function ($scope, $location, $log, currentUser, listUtil, commonUtil, categoryCache,
                        projectFace, faceCache, ProjectService) {

                var defaultCategory = null;

                $scope.init = function () {
                    $scope.events = {
                        isLoading: false,
                        alertMessage: ''
                    };
                    $scope.faceModel = {
                        users: [],
                        participants: [],
                        allParticipantChecked: false,
                        createSameNameActivity: false
                    };
                    commonUtil.bindUserList($scope.faceModel.users);
                    categoryCache.get('activity', 'normal', function (e) {
                        defaultCategory = e;
                    });
                }

                $scope.addParticipant = function (user) {
                    listUtil.add($scope.faceModel.participants, user);
                }

                $scope.removeParticipant = function (user) {
                    listUtil.remove($scope.faceModel.participants, user);
                }

                $scope.checkOrNotAllParticipant = function () {
                    if ($scope.faceModel.allParticipantChecked) {
                        listUtil.shallowCopyList($scope.faceModel.participants, $scope.faceModel.users);
                    } else {
                        $scope.faceModel.participants.length = 0;
                    }
                }

                $scope.save = function () {
                    if ($scope.faceModel.name != undefined && $scope.faceModel.name != null) {
                        var usernameArray = [];
                        for (var i = 0; i < $scope.faceModel.participants.length; i++) {
                            usernameArray.push($scope.faceModel.participants[i].Username);
                        }
                        var category = null;
                        if ($scope.faceModel.createSameNameActivity) {
                            category = defaultCategory.Code;
                        }
                        $scope.events.alertMessage = '';
                        $scope.events.isLoading = true;
                        ProjectService.save({
                            'user': currentUser.getUsername(),
                            'name': $scope.faceModel.name,
                            'description': $scope.faceModel.description,
                            'participants': usernameArray,
                            'createSameNameActivity': $scope.faceModel.createSameNameActivity,
                            'category': category
                        })
                        .$promise
                            .then(function (result) {
                                faceCache.insertFirst(projectFace, result);
                                $location.path('/project-details/' + result.Id + "/");
                            }, function (error) {
                                $scope.events.alertMessage = "提示：添加项目失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    }
                }

            } ])
        .controller('ProjectEditCtrl', ['$scope', '$routeParams', '$log', 'currentUser', 'projectFace', 'faceCache', 'ProjectService',
            function ($scope, $routeParams, $log, currentUser, projectFace, faceCache, ProjectService) {

                $scope.init = function () {
                    $scope.events = {
                        isLoading: false,
                        alertMessageColor: '',
                        alertMessage: '',
                        project: null
                    };
                    ProjectService.get({
                        'user': currentUser.getUsername(),
                        'projectId': $routeParams.id
                    })
                    .$promise
                        .then(function (result) {
                            $scope.events.project = result;
                        }, function (error) {
                            $scope.events.alertMessageColor = 'alert-danger';
                            $scope.events.alertMessage = "提示：加载项目详细信息失败";
                            $log.error(error);
                        });
                }

                $scope.save = function () {
                    if ($scope.events.project.Name != null) {
                        $scope.events.alertMessage = '';
                        $scope.events.isLoading = true;
                        ProjectService.update({
                            'user': currentUser.getUsername(),
                            'projectId': $scope.events.project.Id,
                            'name': $scope.events.project.Name,
                            'description': $scope.events.project.Description
                        })
                        .$promise
                            .then(function (result) {
                                faceCache.replace(projectFace, result);
                                $scope.events.project = result;
                                $scope.events.alertMessageColor = 'alert-success';
                                $scope.events.alertMessage = "提示：修改项目成功";
                            }, function (error) {
                                $scope.events.alertMessageColor = 'alert-danger';
                                $scope.events.alertMessage = "提示：修改项目失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    }
                }

            } ])
        .controller('ProjectDetailsCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'commonUtil', 'projectFace', 'activityFace', 'faceCache',
                                             'ProjectService', 'ActivityService', 'ActivityOfProjectService',
            function ($scope, $log, $routeParams, currentUser, commonUtil, projectFace, activityFace, faceCache,
                        ProjectService, ActivityService, ActivityOfProjectService) {

                function loadActivityList() {
                    $scope.events.activityList.length = 0;
                    $scope.events.alertMessage = "";
                    $scope.events.isLoading = true;
                    ActivityOfProjectService.query({
                        'user': currentUser.getUsername(),
                        'projectId': $scope.faceModel.projectId
                    })
                    .$promise
                        .then(function (result) {
                            if (result != null && result.length > 0) {
                                faceCache.remove(activityFace, function (item) {
                                    return item.ProjectId === $scope.faceModel.projectId;
                                });
                                faceCache.add(activityFace, result);
                                for (var i = 0; i < result.length; i++) {
                                    var activity = result[i];
                                    activity.isDate = false;
                                    commonUtil.buildCategoryIcon(activity, 'activity');
                                    commonUtil.buildCreatorName(activity);
                                    $scope.events.activityList.push(activity);
                                }
                            }
                        }, function (error) {
                            $scope.events.alertMessage = "提示：加载活动列表失败";
                            $log.error(error);
                        })
                        .then(function () {
                            $scope.events.isLoading = false;
                        });
                }

                $scope.init = function () {
                    $scope.faceModel = {
                        projectId: parseInt($routeParams.id),
                        categoryList: [],
                        isEditable: false,
                        addActivityPanelVisible: false
                    }
                    $scope.events = {
                        isLoading: false,
                        isBusy: false,
                        alertMessage: "",
                        project: faceCache.get(projectFace, $scope.faceModel.projectId),
                        activityList: null
                    };
                    if ($scope.events.project === undefined || $scope.events.project === null) {
                        $scope.events.alertMessage = '';
                        $scope.events.isLoading = true;
                        ProjectService.get({
                            'user': currentUser.getUsername(),
                            'projectId': $scope.faceModel.projectId
                        })
                        .$promise
                            .then(function (result) {
                                commonUtil.buildCreatorName(result);
                                faceCache.insertFirst(projectFace, result);
                                $scope.events.project = result;
                                $scope.faceModel.isEditable = (currentUser.getUsername() === $scope.events.project.Creator);
                            }, function (error) {
                                $scope.events.alertMessage = "提示：加载项目详细信息失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    } else {
                        $scope.faceModel.isEditable = (currentUser.getUsername() === $scope.events.project.Creator);
                    }

                    $scope.events.activityList = faceCache.query(activityFace, function (item) {
                        return item.ProjectId === $scope.faceModel.projectId;
                    });
                    if ($scope.events.activityList.length === 0) {
                        loadActivityList();
                    }

                    commonUtil.bindCategoryList($scope.faceModel.categoryList, 'activity', 'normal', function (e) {
                        $scope.faceModel.category = e;
                    });
                }

                $scope.selectCategory = function (selectedCategory) {
                    commonUtil.selectCategory($scope.faceModel.categoryList, selectedCategory.Code, function (e) {
                        $scope.faceModel.category = e;
                    });
                }

                $scope.toggleAddActivityPanelVisibible = function () {
                    $scope.faceModel.addActivityPanelVisible = !$scope.faceModel.addActivityPanelVisible;
                    if (!$scope.faceModel.addActivityPanelVisible) {
                        $scope.faceModel.name = '';
                        $scope.faceModel.description = '';
                    }
                }

                $scope.refreshActivityList = function () {
                    loadActivityList();
                }

                $scope.saveActivity = function () {
                    if ($scope.faceModel.name != undefined && $scope.faceModel.name != null) {
                        $scope.events.alertMessage = "";
                        $scope.events.isBusy = true;
                        ActivityService.save({
                            'user': currentUser.getUsername(),
                            'projectId': $routeParams.id,
                            'category': $scope.faceModel.category.Code,
                            'name': $scope.faceModel.name,
                            'description': $scope.faceModel.description
                        })
                        .$promise
                            .then(function (result) {
                                result.isDate = false;
                                commonUtil.buildCategoryIcon(result, 'activity');
                                commonUtil.buildCreatorName(result);
                                faceCache.insertFirst(activityFace, result);
                                $scope.toggleAddActivityPanelVisibible();
                                $scope.events.activityList.unshift(result);
                            }, function (error) {
                                $scope.events.alertMessage = "提示：添加活动失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.events.isBusy = false;
                            });
                    }
                }

                $scope.cancel = function () {
                    $scope.toggleAddActivityPanelVisibible();
                }

            } ]);

});