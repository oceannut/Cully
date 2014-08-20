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
        .controller('BizNotificationListCtrl', ['$scope', '$location', '$log', 'currentUser',
            function ($scope, $location, $log, currentUser) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                }

            } ]);

});