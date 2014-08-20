'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./notice-services');

    angular.module('notice.controllers', ['filters', 'utils', 'notice.services'])
        .controller('NoticeListCtrl', ['$scope', '$location', '$log', 'currentUser', 'NoticeListService', 'dateUtil',
            function ($scope, $location, $log, currentUser, NoticeListService, dateUtil) {

                var pageSize = 20;

                function load() {

                    var startRowIndex = $scope.currentPage * pageSize;
                    var date = $scope.queryModel.date;

                    var startDay, span;
                    if (date != '') {
                        if (date == '-30') {
                            $scope.monthInputVisible = '';
                            if ($scope.queryModel.month != '') {
                                var array = $scope.queryModel.month.split('-');
                                var d = new Date(array[0], parseInt(array[1]) - 1, 1);
                                startDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                                span = dateUtil.getDaysofMonth(d.getMonth() + 1);
                            }
                        } else {
                            $scope.monthInputVisible = 'none';
                            startDay = dateUtil.getDate(date);
                            span = dateUtil.getSpan(date);
                        }

                    } else {
                        $scope.monthInputVisible = 'none';
                        startDay = 'null';
                        span = 'null';
                    }
                    if (startDay != undefined && span != undefined) {
                        NoticeListService.query({ 'date': startDay,
                            'span': span,
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    $scope.noticeList = result;
                                }, function (error) {
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessageColor = 'alert-danger';
                                    $scope.alertMessage = "提示：获取公告失败";
                                    $log.error(error);
                                });
                    }

                }

                $scope.init = function () {

                    $scope.alertMessageVisible = 'hidden';

                    $scope.monthInputVisible = 'none';
                    $scope.queryModel = {
                        'date': '',
                        'month': ''
                    }
                    $scope.prevBtnClass = 'disabled';
                    $scope.nextBtnClass = '';
                    $scope.currentPage = -1;

                    $scope.query();

                }

                $scope.query = function () {
                    $scope.currentPage = 0;
                    load();
                }

                $scope.prevPage = function () {
                    if ($scope.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                        load();
                    }
                }

                $scope.nextPage = function () {
                    if ($scope.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.currentPage++;
                    load();
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
                    $scope.isEditable = false;

                    NoticeService.get({ "id": $routeParams.id })
                        .$promise
                            .then(function (result) {
                                $scope.notice = result;
                                if (currentUser.getUsername() === $scope.notice.Creator) {
                                    $scope.isEditable = true;
                                } else {
                                    $scope.isEditable = false;
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：获取公告失败";
                                $log.error(error);
                            });

                }

                $scope.remove = function () {
                    $scope.alertMessageVisible = 'hidden';

                    NoticeService.remove({ "id": $routeParams.id, 'creator': currentUser.getUsername() })
                        .$promise
                            .then(function (result) {
                                $location.path('/notice-list/');
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：删除公告失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $('#removeDialog').modal('hide');
                            });
                }

            } ]);

});