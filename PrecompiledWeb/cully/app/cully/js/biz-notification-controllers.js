'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/events');
    require('../../common/js/biz-notification-services');
    require('../../auth/js/auth-models');

    angular.module('bizNotification.controllers', ['events', 'auth.models', 'bizNotification.services'])
        .factory('resourceMap', function () {
            var map = [
                        { 'key': 'task', 'path': '/task-details/' },
                        { 'key': 'log', 'path': '/log-details/' }
                      ];
            return {
                get: function (key) {
                    if (key === undefined || key === null) {
                        return null;
                    }
                    for (var i in map) {
                        var item = map[i];
                        if (key === item.key) {
                            return item.path;
                        }
                    }
                    return null;
                }
            }
        })
        .controller('UntreatedBizNotificationCtrl', ['$scope', '$location', '$log', 'currentUser', 'UntreatedBizNotificationService',
                    'UntreatedBizNotificationListService', 'userCache', 'resourceMap', 'eventbus',
            function ($scope, $location, $log, currentUser, UntreatedBizNotificationService,
                        UntreatedBizNotificationListService, userCache, resourceMap, eventbus) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    UntreatedBizNotificationListService.list(currentUser.getUsername())
                        .then(function (response) {
                            $scope.notificationList = response.data;
                            for (var i = 0; i < $scope.notificationList.length; i++) {
                                var notification = $scope.notificationList[i];
                                userCache.get(notification.Sender, function (e) {
                                    notification.senderName = (e == null) ? notification.Sender : e.Name;
                                });
                            }
                        }, function (response) {
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：加载任务通知集合失败";
                            $log.error(response);
                        });
                }

                $scope.view = function (item) {
                    var path = resourceMap.get(item.Resource);
                    if (path !== null) {
                        UntreatedBizNotificationService.update({ 'user': currentUser.getUsername(), 'notificationId': item.Id })
                            .$promise
                                .then(function (result) {
                                    eventbus.broadcast('untreatedBizNotificationChanged', $scope.notificationList.length - 1);
                                    $location.path(path + item.ResourceId + '/');
                                }, function (error) {
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：签收通知失败";
                                    $log.error(error);
                                });

                    }
                }

                $scope.checkAll = function () {
                    var notificationIds = [];
                    for (var i = 0; i < $scope.notificationList.length; i++) {
                        notificationIds.push($scope.notificationList[i].Id);
                    }
                    UntreatedBizNotificationService.updateCol({ 'user': currentUser.getUsername(), 'notificationIds': notificationIds })
                        .$promise
                            .then(function (result) {
                                eventbus.broadcast('untreatedBizNotificationChanged', 0);
                                $scope.notificationList.length = 0;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：签收通知失败";
                                $log.error(error);
                            });
                }

            } ])
        .controller('BizNotificationListCtrl', ['$scope', '$location', '$log', 'currentUser', 'BizNotificationListService', 'dateUtil', 'userCache', 'resourceMap',
            function ($scope, $location, $log, currentUser, BizNotificationListService, dateUtil, userCache, resourceMap) {

                var pageSize = 20;

                function load(box) {

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
                        BizNotificationListService.query({
                            'box': box,
                            'user': currentUser.getUsername(),
                            'date': startDay,
                            'span': span,
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    if ('inbox' === box) {
                                        $scope.inboxNotificationList = result;
                                        for (var i = 0; i < $scope.inboxNotificationList.length; i++) {
                                            var notification = $scope.inboxNotificationList[i];
                                            userCache.get(notification.Sender, function (e) {
                                                notification.senderName = (e == null) ? notification.Sender : e.Name;
                                            });
                                        }
                                    } else if ('outbox' === box) {
                                        $scope.outboxNotificationList = result;
                                        for (var i = 0; i < $scope.outboxNotificationList.length; i++) {
                                            var notification = $scope.outboxNotificationList[i];
                                            userCache.get(notification.Receiver, function (e) {
                                                notification.receiverName = (e == null) ? notification.Receiver : e.Name;
                                            });
                                        }
                                    }
                                }, function (error) {
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessageColor = 'alert-danger';
                                    $scope.alertMessage = "提示：获取通知失败";
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

                    $scope.query('inbox');
                    $scope.query('outbox');
                }

                $scope.query = function (box) {
                    $scope.currentPage = 0;
                    load(box);
                }

                $scope.prevPage = function (box) {
                    if ($scope.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                        load(box);
                    }
                }

                $scope.nextPage = function (box) {
                    if ($scope.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.currentPage++;
                    load(box);
                }

                $scope.view = function (item) {
                    var path = resourceMap.get(item.Resource);
                    if (path !== null) {
                        $location.path(path + item.ResourceId + '/');
                    }
                }

            } ]);

});