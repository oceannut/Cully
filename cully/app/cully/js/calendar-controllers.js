'use strict';

define(function (require) {

    require('ng');

    require('jquery');
    require('underscore');
    require('bootstrap');
    require('../../../lib/jstimezonedetect/jstz');
    require('../../../lib/bootstrap-calendar/css/calendar.min.css');
    require('../../../lib/bootstrap-calendar/js/language/zh-CN');
    require('../../../lib/bootstrap-calendar/js/calendar');

    require('../../auth/js/auth-models');
    require('../../../static/js/utils');
    require('../../common/js/common-cache');

    require('./calendar-services');

    angular.module('calendar.controllers', ['utils', 'auth.models', 'calendar.services'])
        .controller('CalendarSummaryCtrl', ['$scope', '$routeParams', '$log', 'dateUtil', 'currentUser', 'CalendarListService',
            function ($scope, $routeParams, $log, dateUtil, currentUser, CalendarListService) {

                var calendarOptions = {
                    events_source: [],
                    language: 'zh-CN',
                    view: 'month',
                    tmpl_cache: false,
                    tmpl_path: 'lib/bootstrap-calendar/tmpls/',
                    modal: "#events-modal",
                    modal_type: "template",
                    modal_title: function (e) { return "日程对话框" },
                    onAfterEventsLoad: function (events) {
                        if (!events) {
                            return;
                        }
                    },
                    onAfterViewLoad: function (view) {
                        $('#canlendarTitle').text(' ' + this.getTitle());
                        $('.btn-group button').removeClass('active');
                        $('button[data-calendar-view="' + view + '"]').addClass('active');
                    },
                    classes: {
                        months: {
                            general: 'label'
                        }
                    }
                };
                var calendarCtrl;
                var lastMonth;

                function getMonth(dateString) {
                    var year = dateString.substr(0, 4);
                    var month = dateString.substr(5, 2);
                    return year + '-' + month;
                }

                function refresh(day, view) {
                    var month
                    if ("year" === view) {
                        month = day.substr(0, 4);
                    } else {
                        month = getMonth(day);
                    }
                    if (month !== lastMonth) {
                        lastMonth = month;
                        query(day);
                    }
                }

                function query(dateString) {
                    var year = lastMonth.substr(0, 4);
                    var month = 'null';
                    if (lastMonth.length > 5) {
                        month = lastMonth.substr(5, 2);
                    }
                    CalendarListService.query({
                        'year': year,
                        'month': month,
                        'type': 'null',
                        'user': currentUser.getUsername()
                    })
                    .$promise
                        .then(function (result) {
                            var list = [];
                            $scope.calendarList = [];
                            $scope.clockList = [];
                            if (result != null && result.length > 0) {
                                var color = "";
                                var start = "";
                                var end = "";
                                for (var i = 0; i < result.length; i++) {
                                    var calendar = result[i];
                                    if (0 === calendar.Type) {
                                        switch (calendar.Level) {
                                            case 1:
                                                color = "event-info";
                                                break;
                                            case 2:
                                                color = "event-warning";
                                                break;
                                            case 3:
                                                color = "event-important";
                                                break;
                                        }
                                        start = dateUtil.jsonToTicks(calendar.Appointed);
                                        end = dateUtil.jsonToTicks(calendar.EndAppointed);
                                        list.push({
                                            "id": calendar.Id,
                                            "title": calendar.Content,
                                            "class": color,
                                            "start": start,
                                            "end": end
                                        });
                                        switch (calendar.Level) {
                                            case 1:
                                                calendar.textColor = "text-light-blue";
                                                break;
                                            case 2:
                                                calendar.textColor = "text-yellow";
                                                break;
                                            case 3:
                                                calendar.textColor = "text-red";
                                                break;
                                        }
                                        $scope.calendarList.push(calendar);
                                    }
                                    else {
                                        var caution = dateUtil.jsonToDate(calendar.Caution);
                                        var hour = caution.getHours();
                                        var minute = caution.getMinutes();
                                        calendar.caution = (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute);
                                        $scope.clockList.push(calendar);
                                    }
                                }
                            }

                            calendarCtrl.setOptions({ events_source: list });
                            calendarCtrl.setOptions({ day: dateString });
                            calendarCtrl.view();

                        }, function (error) {
                            $log.error(error);
                        });
                }

                $scope.init = function () {
                    calendarCtrl = $('#calendar').calendar(calendarOptions);
                    $('.btn-group button[data-calendar-nav]').each(function () {
                        var $this = $(this);
                        $this.click(function () {
                            calendarCtrl.navigate($this.data('calendar-nav'));
                            refresh(calendarCtrl.options.day, calendarCtrl.options.view);
                        });
                    });
                    $('.btn-group button[data-calendar-view]').each(function () {
                        var $this = $(this);
                        $this.click(function () {
                            calendarCtrl.view($this.data('calendar-view'));
                            refresh(calendarCtrl.options.day, calendarCtrl.options.view);
                        });
                    });

                    var dateString = $routeParams.day;
                    if (undefined === dateString || 'null' === dateString) {
                        dateString = dateUtil.formatDateByYMD(new Date());
                    }
                    lastMonth = getMonth(dateString);
                    query(dateString);
                }

            } ])
        .controller('CalendarListCtrl', ['$scope', '$routeParams', '$log', 'dateUtil', 'currentUser', 'CalendarListService',
            function ($scope, $routeParams, $log, dateUtil, currentUser, CalendarListService) {

                function renderList() {
                    if ($scope.calendarList != null) {
                        var len = $scope.calendarList.length;
                        for (var i = 0; i < len; i++) {
                            var calendar = $scope.calendarList[i];
                            switch (calendar.Level) {
                                case 1:
                                    calendar.textColor = "text-light-blue";
                                    break;
                                case 2:
                                    calendar.textColor = "text-yellow";
                                    break;
                                case 3:
                                    calendar.textColor = "text-red";
                                    break;
                            }
                            if (currentUser.getUsername() === calendar.Creator) {
                                calendar.isEidtable = true;
                            } else {
                                calendar.isEidtable = false;
                            }
                        }
                    }
                }

                $scope.init = function () {
                    var timestamp = new Date();
                    $scope.queryModel = {
                        month: timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1)
                    };

                    $scope.query();
                }

                $scope.query = function () {
                    if ($scope.queryModel.month !== "") {
                        var year = $scope.queryModel.month.substr(0, 4);
                        var month = $scope.queryModel.month.substr(5, 2);
                        CalendarListService.query({
                            'year': year,
                            'month': month,
                            'type': '0',
                            'user': currentUser.getUsername()
                        })
                        .$promise
                            .then(function (result) {
                                $scope.calendarList = result;
                                renderList();
                            }, function (error) {
                                $log.error(error);
                            });
                    }
                }

            } ])
        .controller('CalendarEditCtrl', ['$scope', '$location', '$routeParams', '$log',
                                            'dateUtil', 'currentUser', 'listUtil', 'userCache',
                                            'CalendarService', 'CalendarCautionListService', 'CalendarCautionService',
            function ($scope, $location, $routeParams, $log,
                            dateUtil, currentUser, listUtil, userCache,
                            CalendarService, CalendarCautionListService, CalendarCautionService) {

                $scope.init = function () {
                    $scope.isLoading = false;
                    $scope.alertMessage = "";
                    $scope.users = [];
                    $scope.participants = [];
                    userCache.list(function (result) {
                        listUtil.shallowCopyList($scope.users, result, false, function (e) {
                            return (e.Username !== currentUser.getUsername() & e.Roles.indexOf('user') > -1);
                        });
                    });

                    $scope.projectId = $routeParams.projectId;
                    $scope.id = $routeParams.id;
                    if ($scope.id === '0') {
                        //添加日程
                        var timestamp = new Date();
                        var timestampString = dateUtil.formatDateByYMD(timestamp);
                        var hour = (timestamp.getHours() + 1) % 24;
                        $scope.calendar = {
                            appointed: timestampString,
                            endAppointed: timestampString,
                            Level: 1,
                            Repeat: 0,
                            IsCaution: false,
                            caution: (hour < 10 ? '0' + hour : hour) + ':00',
                            isMoreParticipants: false
                        };
                    } else {
                        //编辑日程
                        CalendarService.get({
                            'id': $scope.id
                        })
                        .$promise
                            .then(function (result) {
                                $scope.calendar = result;
                                if ($scope.calendar != null) {
                                    $scope.calendar.appointed = dateUtil.formatDateByYMD(dateUtil.jsonToDate($scope.calendar.Appointed));
                                    $scope.calendar.endAppointed = dateUtil.formatDateByYMD(dateUtil.jsonToDate($scope.calendar.EndAppointed));
                                }
                                if ($scope.calendar.Caution !== null) {
                                    var caution = dateUtil.jsonToDate($scope.calendar.Caution);
                                    var hour = caution.getHours();
                                    var minute = caution.getMinutes();
                                    $scope.calendar.caution = (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute);
                                }
                            }, function (error) {
                                $scope.alertMessage = "提示：获取日程失败";
                                $log.error(error);
                            })
                            .then(function () {

                                CalendarCautionListService.query({
                                    'calendarId': $scope.id
                                })
                                .$promise
                                    .then(function (result) {
                                        if (result != null) {
                                            var len = result.length;
                                            $scope.calendar.isMoreParticipants = (len > 1) ? true : false;
                                            for (var i = 0; i < len; i++) {
                                                var item = result[i];
                                                for (var j in $scope.users) {
                                                    if ($scope.users[j].Username === item.Staff) {
                                                        $scope.participants.push($scope.users[j]);
                                                        //$scope.users.splice(j, 1);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }, function (error) {
                                        $scope.alertMessage = "提示：获取日程的参与成员失败";
                                        $log.error(error);
                                    });

                            });

                    }
                }

                $scope.addParticipant = function (user) {
                    if (listUtil.add($scope.participants, user) && $scope.id !== '0') {
                        $scope.alertMessage = "";
                        $scope.isLoading = true;
                        CalendarCautionService.save({
                            'calendarId': $scope.calendar.Id,
                            'participant': user.Username
                        })
                        .$promise
                            .then(function (result) {
                                $scope.alertMessage = "提示：添加成员成功";
                                $scope.alertMessageColor = "alert-success";
                            }, function (error) {
                                $scope.alertMessage = "提示：添加成员失败";
                                $scope.alertMessageColor = "alert-danger";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

                $scope.removeParticipant = function (user) {
                    if (listUtil.remove($scope.participants, user) && $scope.id !== '0') {
                        $scope.alertMessage = "";
                        $scope.isLoading = true;
                        CalendarCautionService.remove({
                            'calendarId': $scope.calendar.Id,
                            'participant': user.Username
                        })
                        .$promise
                            .then(function (result) {
                                $scope.alertMessage = "提示：移除成员成功";
                                $scope.alertMessageColor = "alert-success";
                            }, function (error) {
                                $scope.alertMessage = "提示：移除成员失败";
                                $scope.alertMessageColor = "alert-danger";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

                $scope.checkOrNotAllParticipant = function () {
                    if ($scope.allParticipantChecked) {
                        listUtil.shallowCopyList($scope.participants, $scope.users);
                    } else {
                        $scope.participants.length = 0;
                    }
                }

                $scope.viewList = function () {
                    if ($scope.projectId > 0) {
                        $location.path("/project-calendar-list/" + $scope.projectId + "/");
                    } else {
                        $location.path("/calendar-list/");
                    }
                }

                $scope.viewCalendar = function () {
                    $location.path("/calendar-summary/" + $scope.calendar.appointed + "/");
                }

                $scope.save = function () {
                    if ($scope.calendar.endAppointed < $scope.calendar.appointed) {
                        alert("结束日期应大于等于开始日期");
                        return;
                    }
                    $scope.alertMessage = "";
                    $scope.isLoading = true;
                    if ($scope.id === '0') {
                        var usernameArray = [];
                        for (var i = 0; i < $scope.participants.length; i++) {
                            usernameArray.push($scope.participants[i].Username);
                        }
                        CalendarService.save({
                            'user': currentUser.getUsername(),
                            'projectId': $scope.projectId,
                            'appointed': $scope.calendar.appointed,
                            'endAppointed': $scope.calendar.endAppointed,
                            'content': $scope.calendar.Content,
                            'level': $scope.calendar.Level,
                            'repeat': $scope.calendar.Repeat,
                            'caution': $scope.calendar.caution,
                            'isCaution': $scope.calendar.IsCaution,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                if ($scope.projectId > 0) {
                                    $location.path("/project-calendar-list/" + $scope.projectId + "/");
                                } else {
                                    $location.path("/calendar-list/");
                                }
                            }, function (error) {
                                $scope.alertMessage = "提示：添加日程失败";
                                $scope.alertMessageColor = "alert-danger";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    } else {
                        CalendarService.update({
                            'id': $scope.calendar.Id,
                            'appointed': $scope.calendar.appointed,
                            'endAppointed': $scope.calendar.endAppointed,
                            'content': $scope.calendar.Content,
                            'level': $scope.calendar.Level,
                            'repeat': $scope.calendar.Repeat,
                            'caution': $scope.calendar.caution,
                            'isCaution': $scope.calendar.IsCaution
                        })
                        .$promise
                            .then(function (result) {
                                $scope.alertMessage = "提示：更新日程成功";
                                $scope.alertMessageColor = "alert-success";
                            }, function (error) {
                                $scope.alertMessage = "提示：更新日程失败";
                                $scope.alertMessageColor = "alert-danger";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

            } ])
        .controller('ClockEditCtrl', ['$scope', '$routeParams', '$log', '$location',
                         'dateUtil', 'currentUser', 'listUtil', 'userCache',
                         'ClockService', 'CalendarService', 'CalendarCautionListService', 'CalendarCautionService',
            function ($scope, $routeParams, $log, $location,
                         dateUtil, currentUser, listUtil, userCache,
                         ClockService, CalendarService, CalendarCautionListService, CalendarCautionService) {

                $scope.init = function () {
                    $scope.isLoading = false;
                    $scope.alertMessage = "";
                    $scope.users = [];
                    $scope.participants = [];
                    userCache.list(function (result) {
                        listUtil.shallowCopyList($scope.users, result, false, function (e) {
                            return (e.Username !== currentUser.getUsername() & e.Roles.indexOf('user') > -1);
                        });
                    });

                    $scope.id = $routeParams.id;
                    if ($scope.id === '0') {
                        //添加时钟
                        var timestamp = new Date();
                        var hour = (timestamp.getHours() + 1) % 24;
                        $scope.calendar = {
                            Repeat: 0,
                            caution: (hour < 10 ? '0' + hour : hour) + ':00',
                            isMoreParticipants: false
                        };
                    } else {
                        //编辑时钟
                        CalendarService.get({
                            'id': $scope.id
                        })
                        .$promise
                            .then(function (result) {
                                $scope.calendar = result;
                                if ($scope.calendar.Repeat > 10) {
                                    $scope.calendar.customRepeat = $scope.calendar.Repeat;
                                    $scope.calendar.Repeat = -1;
                                }
                                if ($scope.calendar.Caution !== null) {
                                    var caution = dateUtil.jsonToDate($scope.calendar.Caution);
                                    var hour = caution.getHours();
                                    var minute = caution.getMinutes();
                                    $scope.calendar.caution = (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute);
                                }
                            }, function (error) {
                                $scope.alertMessage = "提示：获取时钟失败";
                                $log.error(error);
                            })
                            .then(function () {

                                CalendarCautionListService.query({
                                    'calendarId': $scope.id
                                })
                                .$promise
                                    .then(function (result) {
                                        if (result != null) {
                                            var len = result.length;
                                            $scope.calendar.isMoreParticipants = (len > 1) ? true : false;
                                            for (var i = 0; i < len; i++) {
                                                var item = result[i];
                                                for (var j in $scope.users) {
                                                    if ($scope.users[j].Username === item.Staff) {
                                                        $scope.participants.push($scope.users[j]);
                                                        //$scope.users.splice(j, 1);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }, function (error) {
                                        $scope.alertMessage = "提示：获取时钟的提醒成员失败";
                                        $log.error(error);
                                    });

                            });

                    }

                }

                $scope.addParticipant = function (user) {
                    if (listUtil.add($scope.participants, user) && $scope.id !== '0') {
                        $scope.alertMessage = "";
                        $scope.isLoading = true;
                        CalendarCautionService.save({
                            'calendarId': $scope.calendar.Id,
                            'participant': user.Username
                        })
                        .$promise
                            .then(function (result) {
                                $scope.alertMessage = "提示：添加成员成功";
                                $scope.alertMessageColor = "alert-success";
                            }, function (error) {
                                $scope.alertMessage = "提示：添加成员失败";
                                $scope.alertMessageColor = "alert-danger";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

                $scope.removeParticipant = function (user) {
                    if (listUtil.remove($scope.participants, user) && $scope.id !== '0') {
                        $scope.alertMessage = "";
                        $scope.isLoading = true;
                        CalendarCautionService.remove({
                            'calendarId': $scope.calendar.Id,
                            'participant': user.Username
                        })
                        .$promise
                            .then(function (result) {
                                $scope.alertMessage = "提示：移除成员成功";
                                $scope.alertMessageColor = "alert-success";
                            }, function (error) {
                                $scope.alertMessage = "提示：移除成员失败";
                                $scope.alertMessageColor = "alert-danger";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

                $scope.checkOrNotAllParticipant = function () {
                    if ($scope.allParticipantChecked) {
                        listUtil.shallowCopyList($scope.participants, $scope.users);
                    } else {
                        $scope.participants.length = 0;
                    }
                }

                $scope.save = function () {
                    var repeat = $scope.calendar.Repeat;
                    if (repeat === "-1") {
                        repeat = $scope.calendar.customRepeat;
                    }
                    var caution = $scope.calendar.caution;
                    if ($scope.calendar.endAppointed < $scope.calendar.appointed) {
                        alert("结束日期应大于等于开始日期");
                        return;
                    }
                    $scope.alertMessage = "";
                    $scope.isLoading = true;
                    if ($scope.id === '0') {
                        var usernameArray = [];
                        for (var i = 0; i < $scope.participants.length; i++) {
                            usernameArray.push($scope.participants[i].Username);
                        }
                        ClockService.save({
                            'user': currentUser.getUsername(),
                            'content': $scope.calendar.Content,
                            'repeat': repeat,
                            'caution': $scope.calendar.caution,
                            'participants': usernameArray
                        })
                        .$promise
                            .then(function (result) {
                                $location.path("/clock-list/");
                            }, function (error) {
                                $scope.alertMessage = "提示：保存时钟失败";
                                $scope.alertMessageColor = "alert-danger";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    } else {
                        ClockService.update({
                            'id': $scope.id,
                            'content': $scope.calendar.Content,
                            'repeat': repeat,
                            'caution': $scope.calendar.caution,
                            'isCaution': $scope.calendar.IsCaution
                        })
                        .$promise
                            .then(function (result) {
                                $scope.alertMessage = "提示：保存时钟成功";
                                $scope.alertMessageColor = "alert-success";
                            }, function (error) {
                                $scope.alertMessage = "提示：保存时钟失败";
                                $scope.alertMessageColor = "alert-danger";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });

                    }
                }

            } ])
        .controller('ClockListCtrl', ['$scope', '$routeParams', '$log', 'dateUtil', 'currentUser',
                                         'CalendarListService', 'CalendarService4UpdateCaution',
            function ($scope, $routeParams, $log, dateUtil, currentUser,
                        CalendarListService, CalendarService4UpdateCaution) {

                $scope.init = function () {
                    $scope.query();
                }

                $scope.query = function () {
                    var currentUsername = currentUser.getUsername();
                    var timestamp = new Date();
                    CalendarListService.query({
                        'year': timestamp.getFullYear(),
                        'month': timestamp.getMonth() + 1,
                        'type': '1',
                        'user': currentUsername
                    })
                    .$promise
                        .then(function (result) {
                            $scope.calendarList = result;
                            if ($scope.calendarList != null) {
                                var len = $scope.calendarList.length;
                                for (var i = 0; i < len; i++) {
                                    var calendar = $scope.calendarList[i];
                                    switch (calendar.Level) {
                                        case 1:
                                            calendar.textColor = "text-light-blue";
                                            break;
                                        case 2:
                                            calendar.textColor = "text-yellow";
                                            break;
                                        case 3:
                                            calendar.textColor = "text-red";
                                            break;
                                    }
                                    if (currentUsername === calendar.Creator) {
                                        calendar.isEidtable = true;
                                    } else {
                                        calendar.isEidtable = false;
                                    }
                                }
                            }
                        }, function (error) {
                            $log.error(error);
                        });
                }

                $scope.toggleCaution = function (calendar) {
                    $scope.alertMessage = "";
                    CalendarService4UpdateCaution.update({
                        'id': calendar.Id,
                        'isCaution': !calendar.IsCaution
                    })
                    .$promise
                        .then(function (result) {
                            calendar.IsCaution = !calendar.IsCaution;
                        }, function (error) {
                            $scope.alertMessage = "提示：修改时钟状态失败";
                            $log.error(error);
                        });
                }

            } ]);

});