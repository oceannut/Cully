'use strict';

define(function (require) {

    require('ng');
    require('bootstrap');
    require('../../../static/js/configs');
    require('../../../static/js/events');
    require('../../auth/js/auth-models');
    require('./user-services');

    angular.module('user.controllers', ['configs', 'user.services'])
        .controller('UserSettingCtrl', ['$scope', '$routeParams', '$log', 'UserService', 'currentUser', 'eventbus',
            function ($scope, $routeParams, $log, UserService, currentUser, eventbus) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    $scope.user = {};
                    $scope.isBusy = false;

                    UserService.get({ "username": $routeParams.username })
                        .$promise
                            .then(function (result) {
                                $scope.user = result;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载用户失败";
                                $log.error(error);
                            });
                }

                $scope.save = function () {
                    UserService.update({
                        'username': $scope.user.Username,
                        'name': $scope.user.Name,
                        'group': null
                    })
                    .$promise
                        .then(function (result) {
                            $scope.isSuccess = true;
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：修改成功";
                            currentUser.setDetails({ "name": $scope.user.Name, "roles": $scope.user.Roles });
                            eventbus.broadcast("userModified", $scope.user.Username);
                        }, function (error) {
                            $scope.isSuccess = false;
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：修改失败";
                            $log.error(error);
                        })
                        .then(function () {
                            $scope.isBusy = false;
                        });
                }

            } ]);

});