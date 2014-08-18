'use strict';

define(function (require) {

    require('ng');
    require('../../common/js/biz-notification-services');
    require('../../auth/js/auth-models');

    angular.module('bizNotification.controllers', ['events', 'auth.models', 'bizNotification.services'])
        .controller('UntreatedBizNotificationCtrl', ['$scope', '$log', 'currentUser', 'UntreatedBizNotificationListService', 'userCache',
            function ($scope, $log, currentUser, UntreatedBizNotificationListService, userCache) {

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
                    console.log(item.Resource + ":" + item.ResourceId);
                }

            } ])
        .controller('BizNotificationListCtrl', ['$scope', '$location', '$log', 'currentUser',
            function ($scope, $location, $log, currentUser) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                }

            } ]);

});