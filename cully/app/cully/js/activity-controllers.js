'use strict';

define(function (require) {

    require('ng');

    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('../../../static/js/face-cache');
    require('../../auth/js/auth-models');
    require('../../auth/js/auth-directives');
    require('../../common/js/common-utils');
    require('./client-services');
    require('./project-services');
    require('./cully-constants');

    require('../../../lib/bs-timeline/css/timeline.css');
    require('../../../static/css/icon.css');

    angular.module('activity.controllers', ['filters', 'utils', 'auth.models', 'auth.directives', 'face.cache',
                                            'common.utils', 'client.services', 'project.services', 'cully.constants'])
        .controller('ActivityListCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'dateUtil', 'commonUtil',
                                            'activityFace', 'faceCache', 'localStorageUtil', 'ActivityListService',
            function ($scope, $log, $routeParams, currentUser, dateUtil, commonUtil,
                        activityFace, faceCache, localStorageUtil, ActivityListService) {

                var pageSize = localStorageUtil.getUserData(currentUser.getUsername(), localStorageUtil.pageSize, localStorageUtil.pageSizeDV, true);
                var faceModel = {
                    categoryList: null,
                    category: '',
                    date: '',
                    month: '',
                    currentPage: -1,
                    prevBtnClass: 'disabled',
                    nextBtnClass: ''
                };

                function loadActivityList(isLastPage) {
                    $scope.events.activityList.length = 0;

                    var category = $scope.faceModel.category;
                    var date = $scope.faceModel.date;

                    if (category === '') {
                        category = 'null';
                    }
                    var startDay, span;
                    if (date !== '') {
                        if (date === '-30') {
                            if ($scope.faceModel.month !== '') {
                                var array = $scope.faceModel.month.split('-');
                                var d = new Date(array[0], parseInt(array[1]) - 1, 1);
                                startDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                                span = dateUtil.getDaysofMonth(d.getMonth() + 1);
                            }
                        } else {
                            startDay = dateUtil.getDate(date);
                            span = dateUtil.getSpan(date);
                        }

                    } else {
                        startDay = 'null';
                        span = 'null';
                    }
                    if (startDay != undefined && span != undefined) {
                        $scope.events.alertMessage = "";
                        $scope.events.isLoading = true;
                        var startRowIndex = $scope.faceModel.currentPage * pageSize;
                        ActivityListService.query3({
                            'user': currentUser.getUsername(),
                            'category': category,
                            'date': startDay,
                            'span': span,
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    faceCache.setModel(activityFace, $scope.faceModel);
                                    faceCache.init(activityFace, result);
                                    interceptActivityList(result);
                                    if (isLastPage) {
                                        $scope.events.alertMessage = "提示：已浏览到最后一页";
                                        $scope.events.alertMessageColor = "alert-warning";
                                    }
                                }, function (error) {
                                    $log.error(error);
                                    $scope.events.alertMessage = "提示：活动列表加载失败";
                                    $scope.events.alertMessageColor = "alert-danger";
                                })
                                .then(function () {
                                    $scope.events.isLoading = false;
                                });
                    }
                }

                function interceptActivityList(result) {
                    if (result != null && result.length > 0) {
                        var temp = new Date();
                        temp.setFullYear(1970, 0, 1);
                        var d = dateUtil.formatDateByYMD(temp);
                        var now = new Date();
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            var creationDate = dateUtil.jsonToDate(item.Creation);
                            var creation = dateUtil.formatDateByYMD(creationDate);
                            if (d != creation) {
                                d = creation;
                                if (now.getFullYear() === creationDate.getFullYear()
                                        && now.getMonth() === creationDate.getMonth()
                                        && now.getDate() === creationDate.getDate()) {
                                    $scope.events.activityList.push({ 'isDate': true, 'date': '今日（' + creationDate.getDate() + '日）', 'labelColor': 'bg-red' });
                                } else if (now.getFullYear() === creationDate.getFullYear()
                                        && now.getMonth() === creationDate.getMonth()
                                        && (now.getDate() - 1) === creationDate.getDate()) {
                                    $scope.events.activityList.push({ 'isDate': true, 'date': '昨日（' + creationDate.getDate() + '日）', 'labelColor': 'bg-green' });
                                } else {
                                    $scope.events.activityList.push({ 'isDate': true, 'date': d, 'labelColor': 'bg-maroon' });
                                }
                            }
                            item.isDate = false;
                            commonUtil.buildCategoryIcon(item, 'activity', 'fa fa-bug');
                            commonUtil.buildCreatorName(item);
                            $scope.events.activityList.push(item);
                        }
                        $scope.faceModel.nextBtnClass = '';
                    } else {
                        if ($scope.faceModel.currentPage > 0) {
                            $scope.faceModel.currentPage--;
                            loadActivityList(true);
                        }
                        $scope.faceModel.nextBtnClass = 'disabled';
                    }
                    if ($scope.faceModel.currentPage == 0) {
                        $scope.faceModel.prevBtnClass = 'disabled';
                    } else {
                        $scope.faceModel.prevBtnClass = '';
                    }
                }

                $scope.init = function () {
                    var reload = $routeParams.reload;
                    $scope.events = {
                        isLoading: false,
                        alertMessage: '',
                        alertMessageColor: '',
                        activityList: []
                    };
                    if (reload === 'true') {
                        $scope.faceModel = faceModel;
                        commonUtil.bindCategoryList($scope.faceModel.categoryList, 'activity');

                        $scope.query();
                    } else {
                        $scope.faceModel = faceCache.getModel(activityFace);
                        if ($scope.faceModel === null) {
                            $scope.faceModel = faceModel;
                        }
                        faceCache.pull(activityFace, $scope.events.activityList);
                    }
                }

                $scope.query = function () {
                    $scope.faceModel.currentPage = 0;
                    loadActivityList();
                }

                $scope.prevPage = function () {
                    if ($scope.faceModel.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.faceModel.currentPage > 0) {
                        $scope.faceModel.currentPage--;
                        loadActivityList();
                    }
                }

                $scope.nextPage = function () {
                    if ($scope.faceModel.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.faceModel.currentPage++;
                    loadActivityList();
                }

            } ])
        .controller('ActivityAddCtrl', ['$scope', '$location', '$log', 'listUtil', 'currentUser', 'commonUtil',
                                        'activityFace', 'faceCache', 'ActivityService',
            function ($scope, $location, $log, listUtil, currentUser, commonUtil,
                        activityFace, faceCache, ActivityService) {

                $scope.init = function () {
                    $scope.events = {
                        isLoading: false,
                        alertMessage: ''
                    };
                    $scope.faceModel = {
                        categoryList: [],
                        users: [],
                        participants: [],
                        allParticipantChecked: false
                    };
                    commonUtil.bindUserList($scope.faceModel.users);
                    commonUtil.bindCategoryList($scope.faceModel.categoryList, 'activity', 'normal', function (e) {
                        $scope.faceModel.category = e;
                    });
                }

                $scope.selectCategory = function (selectedCategory) {
                    commonUtil.selectCategory($scope.faceModel.categoryList, selectedCategory.Code, function (e) {
                        $scope.faceModel.category = e;
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
                        $scope.events.alertMessage = '';
                        $scope.events.isLoading = true;
                        ActivityService.saveSolo({
                            'user': currentUser.getUsername(),
                            'category': $scope.faceModel.category.Code,
                            'name': $scope.faceModel.name,
                            'description': $scope.faceModel.description,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                result.isDate = false;
                                commonUtil.buildCategoryIcon(result, 'activity');
                                commonUtil.buildCreatorName(result);
                                faceCache.insertFirst(activityFace, result);
                                $location.path('/activity-details/' + result.Id + '/');
                            }, function (error) {
                                $scope.events.alertMessage = "提示：添加活动失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    }
                }

            } ])
        .controller('ActivityEditCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'commonUtil',
                                            'activityFace', 'faceCache', 'ActivityService',
            function ($scope, $log, $routeParams, currentUser, commonUtil,
                         activityFace, faceCache, ActivityService) {

                $scope.init = function () {
                    $scope.events = {
                        isLoading: false,
                        isBusy: false,
                        alertMessage: '',
                        activity: null
                    };
                    $scope.faceModel = {
                        categoryList: []
                    };
                    commonUtil.bindCategoryList($scope.faceModel.categoryList, 'activity');

                    $scope.events.alertMessage = "";
                    $scope.events.isLoading = true;
                    ActivityService.get({
                        'user': currentUser.getUsername(),
                        'activityId': $routeParams.id
                    })
                    .$promise
                        .then(function (result) {
                            $scope.events.activity = result;
                            commonUtil.selectCategory($scope.faceModel.categoryList, $scope.events.activity.Category, function (e) {
                                $scope.faceModel.category = e;
                            });
                        }, function (error) {
                            $scope.events.alertMessage = "提示：加载活动详细信息失败";
                            $log.error(error);
                        })
                        .then(function () {
                            $scope.events.isLoading = false;
                        });
                }

                $scope.selectCategory = function (selectedCategory) {
                    commonUtil.selectCategory($scope.faceModel.categoryList, selectedCategory.Code, function (e) {
                        $scope.faceModel.category = e;
                    });
                }

                $scope.save = function () {
                    if ($scope.events.activity.Name != undefined && $scope.events.activity.Name != null) {
                        $scope.events.isBusy = true;
                        ActivityService.update({
                            'user': currentUser.getUsername(),
                            'activityId': $scope.events.activity.Id,
                            'category': $scope.faceModel.category.Code,
                            'name': $scope.events.activity.Name,
                            'description': $scope.events.activity.Description
                        })
                        .$promise
                            .then(function (result) {
                                result.isDate = false;
                                commonUtil.buildCategoryIcon(result, 'activity');
                                commonUtil.buildCreatorName(result);
                                faceCache.replace(activityFace, result);
                                $scope.events.activity = result;
                                $scope.events.alertMessageColor = 'alert-success';
                                $scope.events.alertMessage = "提示：修改活动成功";
                            }, function (error) {
                                $scope.events.alertMessageColor = 'alert-danger';
                                $scope.events.alertMessage = "提示：修改活动失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.events.isBusy = false;
                            });
                    }
                }

            } ])
        .controller('ActivityDetailsCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'commonUtil', 'ActivityService', 'activityFace', 'faceCache',
            function ($scope, $log, $routeParams, currentUser, commonUtil, ActivityService, activityFace, faceCache) {

                $scope.init = function () {
                    $scope.faceModel = {
                        isEditable: false,
                        taskListPage: undefined
                    }
                    $scope.events = {
                        isLoading: false,
                        alertMessage: "",
                        activity: faceCache.get(activityFace, parseInt($routeParams.id))
                    };
                    if ($scope.events.activity === undefined || $scope.events.activity === null) {
                        $scope.events.alertMessage = "";
                        $scope.events.isLoading = true;
                        ActivityService.get({
                            'user': currentUser.getUsername(),
                            'activityId': $routeParams.id
                        })
                        .$promise
                            .then(function (result) {
                                result.isDate = false;
                                commonUtil.buildCategoryIcon(result, 'activity');
                                commonUtil.buildCreatorName(result);
                                faceCache.insertFirst(activityFace, result);
                                $scope.events.activity = result;
                                $scope.faceModel.taskListPage = 'app/cully/partials/task-list.htm';
                                $scope.faceModel.isEditable = (currentUser.getUsername() === $scope.events.activity.Creator);
                            }, function (error) {
                                $scope.events.alertMessage = "提示：加载活动详细信息失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    } else {
                        $scope.faceModel.taskListPage = 'app/cully/partials/task-list.htm';
                        $scope.faceModel.isEditable = (currentUser.getUsername() === $scope.events.activity.Creator);
                    }
                }

            } ]);

});