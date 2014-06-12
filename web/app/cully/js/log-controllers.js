'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./log-services');

    angular.module('log.controllers', ['configs', 'filters', 'utils', 'log.services'])
        .controller('LogSummaryCtrl', ['$scope', '$location', 'currentUser', 'dateUtil',
            'LogListService4User', 'LogListService4UserByDate', 'LogListService', 'LogListServiceByDate',
            'UserListService',
            function ($scope, $location, currentUser, dateUtil,
                LogListService4User, LogListService4UserByDate, LogListService, LogListServiceByDate,
                UserListService) {

                var pageSize = 20;

                $scope.init = function () {
                    $scope.queryModel = {
                        'staff': '',
                        'date': ''
                    }
                    $scope.prevBtnClass = 'disabled';
                    $scope.nextBtnClass = '';
                    $scope.currentPage = -1;

                    UserListService.query()
                        .$promise
                            .then(function (result) {
                                $scope.users = result;
                            }, function (error) {
                                console.log("error: " + error);
                            })
                            .then(function () {
                                $scope.query();
                            });
                }

                $scope.createLog = function () {
                    $location.path('/log-add/');
                }

                $scope.query = function () {
                    $scope.currentPage = 0;
                    getLogList();
                }

                $scope.prevPage = function () {
                    if ($scope.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                        getLogList();
                    }
                }

                $scope.nextPage = function () {
                    if ($scope.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.currentPage++;
                    getLogList();
                }

                function getLogList() {
                    var startRowIndex = $scope.currentPage * pageSize;
                    var staff = $scope.queryModel.staff;
                    var date = $scope.queryModel.date;
                    if (staff != '' && date != '') {
                        LogListService4UserByDate.query({ 'user': staff,
                            'date': dateUtil.getDate(date),
                            'span': dateUtil.getSpan(date),
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    interceptLogList(result);
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    } else if (staff == '' && date != '') {
                        LogListServiceByDate.query({ 'date': dateUtil.getDate(date),
                            'span': dateUtil.getSpan(date),
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    interceptLogList(result);
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    } else if (staff != '' && date == '') {
                        LogListService4User.query({ 'user': staff,
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    interceptLogList(result);
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    } else {
                        LogListService.query({ 'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    interceptLogList(result);
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    }
                }

                function interceptLogList(result) {
                    if (result != null && result.length > 0) {
                        $scope.logList = [];
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            item.CreatorName = getCreatorName(item.Creator);
                            $scope.logList.push(item);
                        }
                        $scope.nextBtnClass = '';
                    } else {
                        if ($scope.currentPage > 0) {
                            $scope.currentPage--;
                        } else {
                            $scope.logList = [];
                        }
                        $scope.nextBtnClass = 'disabled';
                    }
                    if ($scope.currentPage == 0) {
                        $scope.prevBtnClass = 'disabled';
                    } else {
                        $scope.prevBtnClass = '';
                    }
                }

                function getCreatorName(creator) {
                    if ($scope.users != undefined && $scope.users != null) {
                        for (var i in $scope.users) {
                            if ($scope.users[i].Username == creator) {
                                creator = $scope.users[i].Name;
                            }
                        }
                    }
                    return creator;
                }

            } ])
        .controller('LogAddCtrl', ['$scope', '$location', 'currentUser', 'LogService',
            function ($scope, $location, currentUser, LogService) {

                $scope.init = function () {
                    $scope.log = {};
                }

                $scope.save = function () {
                    if ($scope.log.startTime != undefined && $scope.log.startTime != ''
                        && $scope.log.content != undefined && $scope.log.content != '') {
                        LogService.save({ 'user': currentUser.username,
                            'date': $scope.log.startTime,
                            'content': $scope.log.content
                        })
                            .$promise
                                .then(function (result) {
                                    $location.path('/log-summary/');
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    }
                }

                $scope.cancel = function () {
                    $location.path('/log-summary/');
                }

            } ]);

});