'use strict';

define(function (require) {

    require('ng');
    //require('jquery');
    //require('bootstrap');
    require('../../../static/js/events');
    require('../../auth/js/auth-models');
    require('./client-services');

    angular.module('client.controllers', ['events', 'auth.models', 'client.services'])
        .controller('ClientSettingCtrl', ['$scope', '$location', '$log', '$anchorScroll', 'eventbus', 'currentUser', 'LocalStorageUtil',
            function ($scope, $location, $log, $anchorScroll, eventbus, currentUser, LocalStorageUtil) {

                var username;

                function load(name, value) {
                    $scope.userData[name] = value;
                }

                function set(name) {

                    LocalStorageUtil.setUserData(username, name, $scope.userData[name]);
                }

                $scope.init = function () {

                    $('#menu').affix();
                    $scope.alertMessage = "";

                    username = currentUser.getUsername();

                    $scope.userData = {};
                    LocalStorageUtil.loadUserData(username, LocalStorageUtil.animation, LocalStorageUtil.animationDV, true, load);
                    LocalStorageUtil.loadUserData(username, LocalStorageUtil.caution, LocalStorageUtil.cautionDV, false, load);
                    LocalStorageUtil.loadUserData(username, LocalStorageUtil.cautionByMusic, LocalStorageUtil.cautionByMusicDV, false, load);
                    LocalStorageUtil.loadUserData(username, LocalStorageUtil.caution4Task, LocalStorageUtil.caution4TaskDV, false, load);
                }

                $scope.gotoAnchor = function (anchor) {
                    $location.hash(anchor);
                    $anchorScroll();
                }

                $scope.save = function () {
                    $scope.alertMessage = "";
                    set(LocalStorageUtil.animation);
                    set(LocalStorageUtil.caution);
                    set(LocalStorageUtil.cautionByMusic);
                    set(LocalStorageUtil.caution4Task);
                    eventbus.broadcast("clientUserDataChanged");
                    $scope.alertMessage = "提示：保存成功";
                }

            } ]);

});