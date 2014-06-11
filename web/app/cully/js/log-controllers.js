'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('./log-services');

    angular.module('log.controllers', ['configs', 'filters', 'log.services'])
        .controller('LogSummaryCtrl', ['$scope', '$location', 'currentUser',
            'LogListService4User', 'LogListService4UserByDate', 'LogListService', 'LogListServiceByDate',
            'UserListService',
            function ($scope, $location, currentUser,
                LogListService4User, LogListService4UserByDate, LogListService, LogListServiceByDate,
                UserListService) {

                $scope.init = function () {
                    $scope.queryModel = {
                        'staff': '',
                        'date': ''
                    }
                    UserListService.query()
                        .$promise
                            .then(function (result) {
                                $scope.users = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                    LogListService.query({ 'start': 0, 'count': 20 })
                        .$promise
                            .then(function (result) {
                                $scope.logList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.createLog = function () {
                    $location.path('/log-add/');
                }

                $scope.query = function () {
                    var staff = $scope.queryModel.staff;
                    var date = $scope.queryModel.date;
                    console.log(getStartDate(new Date(), date));
                    console.log(getSpan(new Date(), date));
                    if (staff != '' && date != '') {
                        LogListService4UserByDate.query({ 'user': currentUser.username,
                            'date': getStartDate(new Date(), date),
                            'span': getSpan(new Date(), date),
                            'start': 0,
                            'count': 20
                        })
                            .$promise
                                .then(function (result) {
                                    $scope.logList = result;
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    } else if (staff == '' && date != '') {

                    } else if (staff != '' && date == '') {

                    } else {

                    }
                }

                function getStartDate(now, date) {
                    if (date == '0') {

                    } else if (date == '-1') {
                        now.setDate(now.getDate() - 1);
                    } else if (date == '7') {
                        now.setDate(now.getDate() - now.getDay());
                    } else if (date == '-7') {
                        now.setDate(now.getDate() - now.getDay() - 7);
                    }
                    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                }

                function getSpan(now, date) {
                    if (date == '0') {
                        return '1';
                    } else if (date == '-1') {
                        return '2';
                    } else if (date == '7') {
                        return (now.getDay() + 1).toString();
                    } else if (date == '-7') {
                        return (now.getDay() + 8).toString();
                    }
                    return '0';
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