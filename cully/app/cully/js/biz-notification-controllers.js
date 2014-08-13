'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('../../common/js/biz-notification-services');

    angular.module('bizNotification.controllers', ['configs', 'filters', 'bizNotification.services'])
        .controller('BizNotificationCtrl', ['$scope', '$location', '$log', 'currentUser', 'UntreatedBizNotificationService', 'userCacheUtil',
            function ($scope, $location, $log, currentUser, UntreatedBizNotificationService, userCacheUtil) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    UntreatedBizNotificationService.query({ 'user': currentUser.username })
                        .$promise
                            .then(function (result) {
                                $scope.notificationList = result;
                                $scope.$parent.$parent.notificationCount = $scope.notificationList.length;
                                for (var i = 0; i < $scope.notificationList.length; i++) {
                                    var notification = $scope.notificationList[i];
                                    var user = userCacheUtil.get(notification.Sender);
                                    notification.senderName = (user == null) ? notification.Sender : user.Name;
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载任务通知集合失败";
                                $log.error(error);
                            });
                }

            } ])
        .controller('BizNotificationListCtrl', ['$scope', '$location', '$log', 'currentUser', 'userCacheUtil',
            function ($scope, $location, $log, currentUser, userCacheUtil) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                }

            } ]);

});