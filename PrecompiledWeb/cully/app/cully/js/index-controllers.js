﻿'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/configs');
    require('../../../static/js/events');
    require('../../common/js/biz-notification-services');
    require('../../auth/js/auth-models');
    require('./client-services');

    angular.module('index.controllers', ['configs', 'events', 'auth.models', 'bizNotification.services', 'client.services'])
        .controller('IndexCtrl', ['$scope', '$location', '$log', '$interval', 'currentUser', 'eventbus', 'appName', 'UntreatedBizNotificationListService', 'LocalStorageUtil',
            function ($scope, $location, $log, $interval, currentUser, eventbus, appName, UntreatedBizNotificationListService, LocalStorageUtil) {

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
                var untreatedBizNotificationCountTimer; //刷新通知个数的时间定义。
                var cautionInterval;

                function loadUntreatedNotificationCount() {
                    UntreatedBizNotificationListService.count(currentUser.getUsername())
                                .then(function (response) {
                                    $scope.untreatedNotificationCount = response.data;
                                    var cautionByMusic = LocalStorageUtil.getUserData(currentUser.getUsername(), LocalStorageUtil.cautionByMusic, LocalStorageUtil.cautionByMusicDV, true);
                                    if (cautionByMusic && $scope.untreatedNotificationCount > 0) {
                                        var audio = document.getElementById("untreatedNotificationAudio");
                                        if (audio !== undefined && audio !== null) {
                                            audio.play();
                                        }
                                    }
                                }, function (response) {
                                    $log.error(response);
                                });
                }

                $scope.init = function () {

                    //订阅事件。
                    eventbus.subscribe("userSignIn", function (e, data) {
                        $scope.makeNavbarVisible();
                        $scope.loginUser = {};
                        $scope.loginUser.username = data;
                        $scope.loginUser.name = currentUser.getName();
                        $scope.loginUser.isAdmin = false;
                        $scope.loginUser.isSupvisor = false;
                        var roles = currentUser.getRoles();
                        if (roles !== undefined && roles !== null) {
                            if (roles.indexOf('admin') > -1) {
                                $scope.loginUser.isAdmin = true;
                            }
                            if (roles.indexOf('supvisor') > -1) {
                                $scope.loginUser.isSupvisor = true;
                            }
                        }

                        loadUntreatedNotificationCount();
                        cautionInterval = LocalStorageUtil.getUserData(currentUser.getUsername(), LocalStorageUtil.caution, LocalStorageUtil.cautionDV, true);
                        if (cautionInterval > 0) {
                            untreatedBizNotificationCountTimer = $interval(function () {
                                loadUntreatedNotificationCount();
                            }, cautionInterval * 1000);
                        }

                    });
                    eventbus.subscribe("userSignOut", function (e, data) {
                        $scope.makeNavbarVisible();
                        $scope.loginUser = undefined;

                        if (untreatedBizNotificationCountTimer !== undefined && untreatedBizNotificationCountTimer !== null) {
                            $interval.cancel(untreatedBizNotificationCountTimer);
                        }

                    });
                    eventbus.subscribe("userModified", function (e, data) {
                        $scope.loginUser.name = currentUser.getName();
                    });
                    eventbus.subscribe('untreatedBizNotificationChanged', function (e, data) {
                        $scope.untreatedNotificationCount = data;
                    });
                    eventbus.subscribe("clientUserDataChanged", function (e, data) {
                        var interval = LocalStorageUtil.getUserData(currentUser.getUsername(), LocalStorageUtil.caution, LocalStorageUtil.cautionDV, true);
                        if (cautionInterval != interval && untreatedBizNotificationCountTimer !== undefined && untreatedBizNotificationCountTimer !== null) {
                            cautionInterval = interval;
                            $interval.cancel(untreatedBizNotificationCountTimer);
                            if (cautionInterval > 0) {
                                untreatedBizNotificationCountTimer = $interval(function () {
                                    loadUntreatedNotificationCount();
                                }, cautionInterval * 1000);
                            }
                        }
                    });

                    //初始化导航条。
                    $scope.appName = appName;
                    $scope.makeNavbarVisible();
                    $scope.navList = [homeNav, categoryNav, userRoleNav];

                    $scope.$on("$destroy", function (event) {
                        if (untreatedBizNotificationCountTimer !== undefined && untreatedBizNotificationCountTimer !== null) {
                            $interval.cancel(untreatedBizNotificationCountTimer);
                        }
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