'use strict';

define(function (require) {

    require('ng');
    require('underscore');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('../../../static/js/face-cache');
    require('./project-services');
    require('./project-cache');
    require('../../auth/js/auth-models');
    require('../../auth/js/auth-directives');
    require('../../common/js/common-cache');
    require('../../common/js/common-utils');

    require('../../../lib/bs-timeline/css/timeline.css');
    require('../../../static/css/icon.css');

    angular.module('activity.controllers', ['filters', 'utils', 'project.services', 'auth.models', 'auth.directives', 'common.cache', 'project.cache', 'face.cache', 'common.utils'])
        .factory('ActivityCommonUtil', ['categoryCache', 'userCache',
            function (categoryCache, userCache) {
                return {
                    buildIcon: function (entity) {
                        entity.icon = 'fa fa-tasks';
                        categoryCache.get('activity', entity.Category, function (e) {
                            entity.icon = e.Icon;
                        });
                    },
                    buildCreatorName: function (entity) {
                        userCache.get(entity.Creator, function (e) {
                            entity.creatorName = (e == null) ? entity.Creator : e.Name;
                        });
                    }
                }
            } ])
        .controller('ActivityListCtrl', ['$scope', '$log', 'currentUser', 'dateUtil', 'ActivityListService', 'ActivityCommonUtil', 'categoryCache', 'activityFace', 'faceCache',
            function ($scope, $log, currentUser, dateUtil, ActivityListService, ActivityCommonUtil, categoryCache, activityFace, faceCache) {

                var pageSize = 20;

                function loadActivityList() {
                    $scope.activityList.length = 0;
                    var startRowIndex = $scope.currentPage * pageSize;
                    var category = $scope.queryModel.category;
                    var date = $scope.queryModel.date;

                    if (category == '') {
                        category = 'null';
                    }
                    var startDay, span;
                    if (date != '') {
                        if (date == '-30') {
                            if ($scope.queryModel.month != '') {
                                var array = $scope.queryModel.month.split('-');
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
                        $scope.queryModel.alertMessage = "";
                        $scope.queryModel.isLoading = true;
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
                                    faceCache.sync(activityFace, result);
                                    interceptActivityList(result);
                                }, function (error) {
                                    $log.error(error);
                                    $scope.queryModel.alertMessage = "提示：活动列表加载失败";
                                })
                                .then(function () {
                                    $scope.queryModel.isLoading = false;
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
                                    $scope.activityList.push({ 'isDate': true, 'date': '今日（' + creationDate.getDate() + '日）', 'labelColor': 'bg-red' });
                                } else if (now.getFullYear() === creationDate.getFullYear()
                                        && now.getMonth() === creationDate.getMonth()
                                        && (now.getDate() - 1) === creationDate.getDate()) {
                                    $scope.activityList.push({ 'isDate': true, 'date': '昨日（' + creationDate.getDate() + '日）', 'labelColor': 'bg-green' });
                                } else {
                                    $scope.activityList.push({ 'isDate': true, 'date': d, 'labelColor': 'bg-maroon' });
                                }
                            }
                            item.isDate = false;
                            ActivityCommonUtil.buildIcon(item);
                            ActivityCommonUtil.buildCreatorName(item);
                            $scope.activityList.push(item);
                        }
                        $scope.nextBtnClass = '';
                    } else {
                        if ($scope.currentPage > 0) {
                            $scope.currentPage--;
                        } else {
                            //$scope.activityList = [];
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
                    $scope.activityList = [];
                    $scope.queryModel = {
                        'isLoading': false,
                        'alertMessage': '',
                        'category': '',
                        'date': '',
                        'month': ''
                    }
                    $scope.prevBtnClass = 'disabled';
                    $scope.nextBtnClass = '';
                    $scope.currentPage = -1;

                    categoryCache.list('activity', function (result) {
                        $scope.categoryList = result;
                    });
                    $scope.query();
                }

                $scope.query = function () {
                    $scope.currentPage = 0;
                    loadActivityList();
                }

                $scope.prevPage = function () {
                    if ($scope.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                        loadActivityList();
                    }
                }

                $scope.nextPage = function () {
                    if ($scope.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.currentPage++;
                    loadActivityList();
                }

            } ])
        .controller('ActivityAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'ActivityService', 'userCache', 'categoryCache', 'listUtil', 'CategoryHelper',
            function ($scope, $location, $log, currentUser, ActivityService, userCache, categoryCache, listUtil, CategoryHelper) {

                $scope.init = function () {

                    $scope.activity = {};
                    $scope.users = [];
                    $scope.participants = [];
                    $scope.isLoading = false;
                    $scope.alertMessageVisible = 'hidden';

                    userCache.list(function (result) {
                        listUtil.shallowCopyList($scope.users, result, false, function (e) {
                            return (e.Username !== currentUser.getUsername() & e.Roles.indexOf('user') > -1);
                        });
                    });

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
                    if ($scope.activity.name != undefined && $scope.activity.name != null) {
                        var usernameArray = [];
                        for (var i = 0; i < $scope.participants.length; i++) {
                            usernameArray.push($scope.participants[i].Username);
                        }
                        $scope.alertMessageVisible = 'hidden';
                        $scope.isLoading = true;
                        ActivityService.saveSolo({
                            'user': currentUser.getUsername(),
                            'category': $scope.category.Code,
                            'name': $scope.activity.name,
                            'description': $scope.activity.description,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/activity-details/' + result.Id + '/');
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

            } ])
        .controller('ActivityEditCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'ActivityService', 'categoryCache', 'userCache', 'CategoryHelper',
            function ($scope, $log, $routeParams, currentUser, ActivityService, categoryCache, userCache, CategoryHelper) {

                $scope.init = function () {

                    $scope.activity = {};
                    $scope.isLoading = false;
                    $scope.alertMessageVisible = 'hidden';

                    categoryCache.list('activity', function (result) {
                        $scope.categoryList = result;
                    });

                    ActivityService.get({ 'user': currentUser.getUsername(), 'activityId': $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.activity = result;
                                CategoryHelper.selectCategory($scope.categoryList, $scope.activity.Category, function (e) {
                                    $scope.category = e;
                                });
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载活动详细信息失败";
                                $log.error(error);
                            });

                }

                $scope.selectCategory = function (selectedCategory) {
                    CategoryHelper.selectCategory($scope.categoryList, selectedCategory.Code, function (e) {
                        $scope.category = e;
                    });
                }

                $scope.save = function () {
                    if ($scope.activity.Name != undefined && $scope.activity.Name != null) {
                        $scope.isLoading = true;
                        ActivityService.update({
                            'user': currentUser.getUsername(),
                            'activityId': $scope.activity.Id,
                            'category': $scope.category.Code,
                            'name': $scope.activity.Name,
                            'description': $scope.activity.Description
                        })
                            .$promise
                                .then(function (result) {
                                    $scope.isLoading = false;
                                    $scope.activity = result;
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessageColor = 'alert-success';
                                    $scope.alertMessage = "提示：修改活动成功";
                                }, function (error) {
                                    $scope.isLoading = false;
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessageColor = 'alert-danger';
                                    $scope.alertMessage = "提示：修改活动失败";
                                    $log.error(error);
                                });
                    }
                }

            } ])
        .controller('ActivityDetailsCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'activityFace', 'faceCache',
            function ($scope, $log, $routeParams, currentUser, activityFace, faceCache) {

                $scope.init = function () {
                    //                    $scope.alertMessageVisible = 'hidden';
                    //                    ActivityService.get({ 'user': currentUser.getUsername(), 'activityId': $routeParams.id })
                    //                        .$promise
                    //                            .then(function (result) {
                    //                                $scope.activity = result;
                    //                                categoryCache.get('activity', $scope.activity.Category, function (e) {
                    //                                    var icon = 'fa fa-tasks';
                    //                                    if (e != null) {
                    //                                        $scope.activity.icon = e.Icon;
                    //                                    }
                    //                                });
                    //                                userCache.get($scope.activity.Creator, function (e) {
                    //                                    $scope.activity.creatorName = (e == null) ? $scope.activity.Creator : e.Name;
                    //                                });
                    //                                $scope.isEditable = currentUser.getUsername() === $scope.activity.Creator;
                    //                                $scope.taskListPage = 'app/cully/partials/task-list.htm';
                    //                            }, function (error) {
                    //                                $scope.alertMessageVisible = 'show';
                    //                                $scope.alertMessage = "提示：加载活动详细信息失败";
                    //                                $log.error(error);
                    //                            });
                    $scope.alertMessage = "";
                    $scope.activity = faceCache.get(activityFace, parseInt($routeParams.id));
                    $scope.isEditable = currentUser.getUsername() === $scope.activity.Creator;
                    $scope.taskListPage = 'app/cully/partials/task-list.htm';
                }

            } ]);

});