'use strict';

define(function (require) {

    require('ng');
    require('../../common/js/biz-notification-services');
    require('../../auth/js/auth-models');

    angular.module('bizNotification.controllers', ['bizNotification.services'])
        .controller('BizNotificationCtrl', ['$scope', '$log', 'currentUser', 'UntreatedBizNotificationService', 'userCache',
            function ($scope, $log, currentUser, UntreatedBizNotificationService, userCache) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    UntreatedBizNotificationService.query({ 'user': currentUser.getUsername() })
                        .$promise
                            .then(function (result) {
                                $scope.notificationList = result;
                                $scope.$parent.$parent.notificationCount = $scope.notificationList.length;
                                for (var i = 0; i < $scope.notificationList.length; i++) {
                                    var notification = $scope.notificationList[i];
                                    userCache.get(notification.Sender, function (e) {
                                        notification.senderName = (e == null) ? notification.Sender : e.Name;
                                    });
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载任务通知集合失败";
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