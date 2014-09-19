'use strict';

define(function (require) {

    require('ng');

    require('../../../static/js/events');
    require('../../auth/js/auth-models');
    require('./client-services');

    angular.module('client.controllers', ['events', 'auth.models', 'client.services'])
        .controller('ClientSettingCtrl', ['$scope', '$location', '$log', '$anchorScroll', 'eventbus', 'currentUser', 'localStorageUtil',
            function ($scope, $location, $log, $anchorScroll, eventbus, currentUser, localStorageUtil) {

                var username;

                function load(name, value) {
                    $scope.userData[name] = value;
                }

                function set(name) {
                    localStorageUtil.setUserData(username, name, $scope.userData[name]);
                }

                $scope.init = function () {

                    $('#menu').affix();
                    $scope.alertMessage = "";

                    username = currentUser.getUsername();

                    $scope.userData = {};
                    localStorageUtil.loadUserData(username, localStorageUtil.animation, localStorageUtil.animationDV, true, load);
                    localStorageUtil.loadUserData(username, localStorageUtil.pageSize, localStorageUtil.pageSizeDV, true, load);
                    localStorageUtil.loadUserData(username, localStorageUtil.caution, localStorageUtil.cautionDV, false, load);
                    localStorageUtil.loadUserData(username, localStorageUtil.cautionByMusic, localStorageUtil.cautionByMusicDV, false, load);
                    localStorageUtil.loadUserData(username, localStorageUtil.caution4Task, localStorageUtil.caution4TaskDV, false, load);
                }

                $scope.gotoAnchor = function (anchor) {
                    $location.hash(anchor);
                    $anchorScroll();
                }

                $scope.save = function () {
                    $scope.alertMessage = "";
                    set(localStorageUtil.animation);
                    set(localStorageUtil.pageSize);
                    set(localStorageUtil.caution);
                    set(localStorageUtil.cautionByMusic);
                    set(localStorageUtil.caution4Task);
                    eventbus.broadcast("clientUserDataChanged");
                    $scope.alertMessage = "提示：保存成功";
                }

            } ]);

});