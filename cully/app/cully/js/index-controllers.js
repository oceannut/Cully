'use strict';

define(function (require) {

    require('ng');

    require('../../../static/js/configs');
    require('../../../static/js/events');
    require('../../../static/js/utils');
    require('../../common/js/biz-notification-services');
    require('../../auth/js/auth-models');
    require('./client-services');
    require('./calendar-services');

    angular.module('index.controllers', ['configs', 'events', 'utils', 'auth.models', 'bizNotification.services', 'client.services'])
        .controller('IndexCtrl', ['$scope', '$location', '$log', '$interval', 'dateUtil', 'currentUser', 'eventbus', 'appName',
                                    'UntreatedBizNotificationListService', 'CalendarOfCautionService', 'localStorageUtil',
            function ($scope, $location, $log, $interval, dateUtil, currentUser, eventbus, appName,
                        UntreatedBizNotificationListService, CalendarOfCautionService, localStorageUtil) {

                var homeNav = {
                    "name": "首页",
                    "url": "/home/",
                    "active": "active"
                };
                var activityNav = {
                    "name": "活动/项目",
                    "url": "/project-summary/true/",
                    "active": ""
                };
                var calendarNav = {
                    "name": "日历",
                    "url": "/calendar-summary/null/",
                    "active": ""
                };
                var logNav = {
                    "name": "记事",
                    "url": "/log-summary/true/",
                    "active": ""
                };
                var fileTransferNav = {
                    "name": "文件",
                    "url": "/file-transfer-overview/",
                    "active": ""
                };
                var statNav = {
                    "name": "统计",
                    "url": "/#/",
                    "active": ""
                };
                var cautionTimer;
                var cautionInterval;

                function loadUntreatedNotificationCount() {
                    UntreatedBizNotificationListService.count(currentUser.getUsername())
                                .then(function (response) {
                                    $scope.untreatedNotificationCount = response.data;
                                    var cautionByMusic = localStorageUtil.getUserData(currentUser.getUsername(), localStorageUtil.cautionByMusic, localStorageUtil.cautionByMusicDV, true);
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

                function loadCautionCalendarList(refresh) {
                    $scope.calendarList.length = 0;
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var week = date.getDay();
                    CalendarOfCautionService.query({
                        'year': year,
                        'month': month,
                        'day': day,
                        'user': currentUser.getUsername()
                    })
                    .$promise
                        .then(function (result) {
                            if (angular.isArray(result)) {
                                var len = result.length;
                                if (len > 0) {
                                    if (!refresh) {
                                        $scope.isCautionClosed = false;
                                    }
                                    var playMusic = false;
                                    for (var i = 0; i < len; i++) {
                                        var item = result[i];
                                        var appointed = dateUtil.jsonToDate(item.Appointed);
                                        var caution = dateUtil.jsonToDate(item.Caution);
                                        switch (item.Repeat) {
                                            case 0:
                                                item.repeatDesc = "当日";
                                                if (year === appointed.getFullYear()
                                                    && month === (appointed.getMonth() + 1)
                                                    && day === appointed.getDate()
                                                    && hour === caution.getHours()
                                                    && minute === caution.getMinutes()) {
                                                    playMusic = true;
                                                }
                                                break;
                                            case 1:
                                                item.repeatDesc = "每天";
                                                if (hour === caution.getHours()
                                                    && minute === caution.getMinutes()) {
                                                    playMusic = true;
                                                }
                                                break;
                                            case 2:
                                                item.repeatDesc = "每周";
                                                if (week === appointed.getDay()
                                                    && hour === caution.getHours()
                                                    && minute === caution.getMinutes()) {
                                                    playMusic = true;
                                                }
                                                break;
                                            case 3:
                                                item.repeatDesc = "每月";
                                                if (day === appointed.getDate()
                                                    && hour === caution.getHours()
                                                    && minute === caution.getMinutes()) {
                                                    playMusic = true;
                                                }
                                                break;
                                            case 5:
                                                item.repeatDesc = "星期一至星期五";
                                                if (day >= 1 && day <= 5
                                                    && hour === caution.getHours()
                                                    && minute === caution.getMinutes()) {
                                                    playMusic = true;
                                                }
                                                break;
                                            default:
                                                var aWeek = item.Repeat - 10;
                                                switch (aWeek) {
                                                    case 0:
                                                        item.repeatDesc = "星期日";
                                                        break;
                                                    case 1:
                                                        item.repeatDesc = "星期一";
                                                        break;
                                                    case 2:
                                                        item.repeatDesc = "星期二";
                                                        break;
                                                    case 3:
                                                        item.repeatDesc = "星期三";
                                                        break;
                                                    case 4:
                                                        item.repeatDesc = "星期四";
                                                        break;
                                                    case 5:
                                                        item.repeatDesc = "星期五";
                                                        break;
                                                    case 6:
                                                        item.repeatDesc = "星期六";
                                                        break;
                                                }
                                                if (day === aWeek
                                                    && hour === caution.getHours()
                                                    && minute === caution.getMinutes()) {
                                                    playMusic = true;
                                                }
                                                break;
                                        }
                                        $scope.calendarList.push(item);
                                    }
                                    if (playMusic) {
                                        var audio = document.getElementById("cautionCalendarAudio");
                                        if (audio !== undefined && audio !== null) {
                                            audio.play();
                                        }
                                    }
                                }
                            }
                        }, function (error) {
                            $log.error(error);
                        });
                }

                $scope.init = function () {

                    $scope.isCautionClosed = true;
                    $scope.calendarList = [];

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
                        loadCautionCalendarList(false);
                        cautionInterval = localStorageUtil.getUserData(currentUser.getUsername(), localStorageUtil.caution, localStorageUtil.cautionDV, true);
                        if (cautionInterval > 0) {
                            cautionTimer = $interval(function () {
                                loadUntreatedNotificationCount();
                                loadCautionCalendarList(true);
                            }, cautionInterval * 1000);
                        }

                    });
                    eventbus.subscribe("userSignOut", function (e, data) {
                        $scope.makeNavbarVisible();
                        $scope.isCautionClosed = true;
                        $scope.loginUser = undefined;

                        if (cautionTimer !== undefined && cautionTimer !== null) {
                            $interval.cancel(cautionTimer);
                        }

                    });
                    eventbus.subscribe("userModified", function (e, data) {
                        $scope.loginUser.name = currentUser.getName();
                    });
                    eventbus.subscribe('untreatedBizNotificationChanged', function (e, data) {
                        $scope.untreatedNotificationCount = data;
                    });
                    eventbus.subscribe("clientUserDataChanged", function (e, data) {
                        var interval = localStorageUtil.getUserData(currentUser.getUsername(), localStorageUtil.caution, localStorageUtil.cautionDV, true);
                        if (cautionInterval != interval && cautionTimer !== undefined && cautionTimer !== null) {
                            cautionInterval = interval;
                            $interval.cancel(cautionTimer);
                            if (cautionInterval > 0) {
                                cautionTimer = $interval(function () {
                                    loadUntreatedNotificationCount();
                                    loadCautionCalendarList(true);
                                }, cautionInterval * 1000);
                            }
                        }
                    });

                    //初始化导航条。
                    $scope.appName = appName;
                    $scope.makeNavbarVisible();
                    $scope.navList = [
                        homeNav,
                        activityNav,
                        calendarNav,
                        logNav,
                        fileTransferNav
                    ];

                    $scope.$on("$destroy", function (event) {
                        if (cautionTimer !== undefined && cautionTimer !== null) {
                            $interval.cancel(cautionTimer);
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