﻿'use strict';

define(function (require) {

    require('angular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('../../common/js/biz-notification-services');

    angular.module('bizNotification.controllers', ['configs', 'filters', 'bizNotification.services'])
        .controller('BizNotificationCtrl', ['$scope', '$location', 'currentUser', 'BizNotificationService',
            function ($scope, $location, currentUser, BizNotificationService) {

                $scope.init = function () {
                    BizNotificationService.query({ 'user': currentUser.username })
                        .$promise
                            .then(function (result) {
                                $scope.bizNotificationList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

            } ]);

});