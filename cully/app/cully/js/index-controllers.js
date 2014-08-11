'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/configs');
    require('../../../static/js/events');
    require('../../auth/js/auth-models');

    angular.module('index.controllers', ['configs', 'events'])
        .controller('IndexCtrl', ['$scope', '$location', 'currentUser', 'eventbus', 'appName',
            function ($scope, $location, currentUser, eventbus, appName) {

                var homeNav = {
                    "name": "首页",
                    "url": "/home/",
                    "active": "active"
                };
                var categoryNav = {
                    "name": "活动/项目",
                    "url": "/project-summary/",
                    "active": ""
                };
                var userRoleNav = {
                    "name": "工作记录",
                    "url": "/log-summary/",
                    "active": ""
                };

                $scope.init = function () {

                    $scope.appName = appName;
                    $scope.makeNavbarVisible();
                    $scope.navList = [homeNav, categoryNav, userRoleNav];

                    eventbus.subscribe("userSignIn", function (e, data) {
                        $scope.makeNavbarVisible();
                        $scope.loginUser = {};
                        $scope.loginUser.username = data;
                        $scope.loginUser.name = currentUser.getName();
                    });
                    eventbus.subscribe("userSignOut", function (e, data) {
                        $scope.makeNavbarVisible();
                        $scope.loginUser = undefined;
                    });
                    eventbus.subscribe("userModified", function (e, data) {
                        $scope.loginUser.name = currentUser.getName();
                    });
                }

                $scope.changeUrl = function (nav) {
                    for (var i = 0; i < $scope.navList.length; i++) {
                        var item = $scope.navList[i];
                        if (item.name == nav.name) {
                            item.active = "active";
                            $location.path(item.url);
                        } else {
                            item.active = "";
                        }
                    }
                }

                $scope.makeNavbarVisible = function () {
                    if (currentUser.isLogin()) {
                        $scope.navbarVisible = '';
                    } else {
                        $scope.navbarVisible = 'none';
                    }
                }

            } ]);


});