'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./notice-services');

    angular.module('notice.controllers', ['filters', 'utils', 'notice.services'])
        .controller('NoticeListCtrl', ['$scope', '$location', '$log', 'currentUser', 'NoticeListService', 'dateUtil',
            function ($scope, $location, $log, currentUser, NoticeListService, dateUtil) {

                $scope.init = function () {

                    $scope.alertMessageVisible = 'hidden';

                    var timeStamp = new Date();

                    NoticeListService.query({ 'date': dateUtil.formatDateByYMD(timeStamp),
                        'span': 1,
                        'start': 0,
                        'count': 10
                    })
                        .$promise
                            .then(function (result) {
                                $scope.noticeList = result;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：获取失败";
                                $log.error(error);
                            });

                }

            } ])
        .controller('NoticeEditCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'NoticeService',
            function ($scope, $location, $log, $routeParams, currentUser, NoticeService) {

                $scope.init = function () {

                    $scope.alertMessageVisible = 'hidden';
                    $scope.isLoading = false;

                    $scope.notice = {};

                    $scope.notice.Id = $routeParams.id;
                    if ($scope.notice.Id != null && $scope.notice.Id != '') {
                        if ($scope.notice.Id === '0') {
                            $scope.actionModeIcon = "fa-plus";
                            $scope.actionMode = "添加";
                        } else {
                            $scope.actionModeIcon = "fa-edit";
                            $scope.actionMode = "编辑";
                            NoticeService.get({ "id": $scope.notice.Id })
                                .$promise
                                    .then(function (result) {
                                        $scope.notice = result;
                                    }, function (error) {
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-danger';
                                        $scope.alertMessage = "提示：获取失败";
                                        $log.error(error);
                                    })
                                    .then(function () {
                                        $scope.isLoading = false;
                                    });
                        }
                    }

                }

                $scope.clear = function () {
                    $scope.actionModeIcon = "fa-plus";
                    $scope.actionMode = "添加";
                    $scope.notice.Id = '0';
                    $scope.notice.Title = '';
                    $scope.notice.Content = '';
                    $scope.alertMessageVisible = 'hidden';
                }

                $scope.save = function () {
                    if ($scope.notice.Id !== null && $scope.notice.Id !== '') {
                        $scope.isLoading = true;
                        if ($scope.notice.Id === '0') {
                            NoticeService.save({ "title": $scope.notice.Title,
                                "content": $scope.notice.Content,
                                "creator": currentUser.getUsername()
                            })
                                .$promise
                                    .then(function (result) {
                                        $scope.notice.Id = result.Id;
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-success';
                                        $scope.alertMessage = "提示：保存成功";
                                    }, function (error) {
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-danger';
                                        $scope.alertMessage = "提示：添加失败";
                                        $log.error(error);
                                    })
                                    .then(function () {
                                        $scope.isLoading = false;
                                    });
                        } else {
                            NoticeService.update({ "id": $routeParams.id,
                                "title": $scope.notice.Title,
                                "content": $scope.notice.Content,
                                "creator": currentUser.getUsername()
                            })
                                .$promise
                                    .then(function (result) {
                                        $scope.notice.Id = result.Id;
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-success';
                                        $scope.alertMessage = "提示：保存成功";
                                    }, function (error) {
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-danger';
                                        $scope.alertMessage = "提示：修改失败";
                                        $log.error(error);
                                    })
                                    .then(function () {
                                        $scope.isLoading = false;
                                    });

                        }
                    }

                }

            } ])
        .controller('NoticeDetailsCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'NoticeService',
            function ($scope, $location, $log, $routeParams, currentUser, NoticeService) {

                $scope.init = function () {

                    $scope.alertMessageVisible = 'hidden';

                    NoticeService.get({ "id": $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.notice = result;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：获取公告失败";
                                $log.error(error);
                            });

                }

            } ]);

});