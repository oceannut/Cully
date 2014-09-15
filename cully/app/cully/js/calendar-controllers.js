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

                $scope.init = function () {

                    var dateString = $routeParams.day;
                    if (undefined === dateString || 'null' === dateString) {
                        dateString = dateUtil.formatDateByYMD(new Date());
                    }
                    var dateArray = dateString.split('-');
                    var year = dateArray[0];
                    var month = dateArray[1];
                    CalendarListService.query({
                        'user': currentUser.getUsername(),
                        'year': year,
                        'month': month,
                        'type': 'null',
                        'projectId': '0'
                    })
                        .$promise
                            .then(function (result) {
                                var list = [];
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
                                                    color = "event-important";
                                                    break;
                                                case 3:
                                                    color = "event-special";
                                                    break;
                                            }
                                            start = dateUtil.jsonToTicks(calendar.Appointed);
                                            end = dateUtil.jsonToTicks(calendar.EndAppointed);
                                            list.push({
                                                "id": calendar.Id,
                                                "title": calendar.Content,
                                                "url": "//" + calendar.Id + "/",
                                                "class": color,
                                                "start": start,
                                                "end": end
                                            });
                                        }

                                    }
                                }

                                var options = {
                                    events_source: list,
                                    language: 'zh-CN',
                                    view: 'month',
                                    tmpl_cache: false,
                                    //day: '2013-03-12',
                                    day: dateString,
                                    tmpl_path: 'lib/bootstrap-calendar/tmpls/',
                                    modal: "#events-modal",
                                    modal_type: "template",
                                    modal_title: function (e) { return e.title },
                                    onAfterEventsLoad: function (events) {
                                        if (!events) {
                                            return;
                                        }
                                        //                                            var list = $('#eventlist');
                                        //                                            list.html('');

                                        //                                            $.each(events, function (key, val) {
                                        //                                                $(document.createElement('li'))
                                        //                            		            .html('<a href="' + val.url + '">' + val.title + '</a>')
                                        //                            		            .appendTo(list);
                                        //                                            });
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
                                var calendar = $('#calendar').calendar(options);

                                $('.btn-group button[data-calendar-nav]').each(function () {
                                    var $this = $(this);
                                    $this.click(function () {
                                        calendar.navigate($this.data('calendar-nav'));
                                    });
                                });

                                $('.btn-group button[data-calendar-view]').each(function () {
                                    var $this = $(this);
                                    $this.click(function () {
                                        calendar.view($this.data('calendar-view'));
                                    });
                                });

                                $('#first_day').change(function () {
                                    var value = $(this).val();
                                    value = value.length ? parseInt(value) : null;
                                    calendar.setOptions({ first_day: value });
                                    calendar.view();
                                });

                                $('#language').change(function () {
                                    calendar.setLanguage($(this).val());
                                    calendar.view();
                                });

                                $('#events-in-modal').change(function () {
                                    var val = $(this).is(':checked') ? $(this).val() : null;
                                    calendar.setOptions({ modal: val });
                                });
                                $('#events-modal .modal-header, #events-modal .modal-footer').click(function (e) {
                                    //e.preventDefault();
                                    //e.stopPropagation();
                                });


                            }, function (error) {
                                $log.error(error);
                            });



                }

            } ])
        .controller('CalendarListCtrl', ['$scope', '$routeParams', '$log', 'dateUtil', 'currentUser', 'CalendarListService',
            function ($scope, $routeParams, $log, dateUtil, currentUser, CalendarListService) {

                $scope.init = function () {
                    $scope.projectId = $routeParams.projectId;

                    var timestamp = new Date();
                    var year = timestamp.getFullYear();
                    var month = timestamp.getMonth() + 1;
                    var currentUsername = currentUser.getUsername();
                    CalendarListService.query({
                        'user': currentUsername,
                        'year': year,
                        'month': month,
                        'type': '0',
                        'projectId': '0'
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
                                                calendar.textColor = "text-red";
                                                break;
                                            case 3:
                                                calendar.textColor = "text-purple";
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
                    var id = $routeParams.id;
                    if (id === '0') {
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
                        CalendarService.get({
                            'user': currentUser.getUsername(),
                            'id': id
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
                                    'user': currentUser.getUsername(),
                                    'id': id
                                })
                                .$promise
                                    .then(function (result) {
                                        if (result != null) {
                                            var len = result.length;
                                            $scope.calendar.isMoreParticipants = (len > 0) ? true : false;
                                            for (var i = 0; i < len; i++) {
                                                var item = result[i];
                                                for (var j in $scope.users) {
                                                    if ($scope.users[j].Username === item.Staff) {
                                                        $scope.participants.push($scope.users[j]);
                                                        $scope.users.splice(j, 1);
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
                    listUtil.add($scope.participants, user);
                }

                $scope.removeParticipant = function (user) {
                    listUtil.remove($scope.participants, user);
                }

                $scope.checkOrNotAllParticipant = function () {
                    if ($scope.allParticipantChecked) {
                        listUtil.shallowCopyList($scope.participants, $scope.users);
                    } else {
                        $scope.participants.length = 0;
                    }
                }

                $scope.save = function () {
                    var usernameArray = [];
                    for (var i = 0; i < $scope.participants.length; i++) {
                        usernameArray.push($scope.participants[i].Username);
                    }
                    $scope.alertMessage = "";
                    $scope.isLoading = true;
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
                                $location.path('/calendar-summary/' + $scope.calendar.Appointed + '/');
                            }, function (error) {
                                $scope.alertMessage = "提示：保存日程失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            }); ;
                }

            } ])
        .controller('ClockEditCtrl', ['$scope', '$routeParams', '$log', '$location',
                         'dateUtil', 'currentUser', 'listUtil', 'userCache', 'ClockService',
            function ($scope, $routeParams, $log, $location,
                         dateUtil, currentUser, listUtil, userCache, ClockService) {

                $scope.init = function () {
                    $scope.isLoading = false;
                    $scope.alertMessage = "";

                    $scope.projectId = $routeParams.projectId;
                    $scope.isBusy = false;
                    var timestamp = new Date();
                    var hour = (timestamp.getHours() + 1) % 24;
                    $scope.calendar = {
                        Repeat: 0,
                        caution: (hour < 10 ? '0' + hour : hour) + ':00',
                        isMoreParticipants: false
                    };

                    $scope.users = [];
                    $scope.participants = [];
                    userCache.list(function (result) {
                        listUtil.shallowCopyList($scope.users, result, false, function (e) {
                            return (e.Username !== currentUser.getUsername() & e.Roles.indexOf('user') > -1);
                        });
                    });
                };

                $scope.addParticipant = function (user) {
                    listUtil.add($scope.participants, user);
                }

                $scope.removeParticipant = function (user) {
                    listUtil.remove($scope.participants, user);
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
                    if (repeat === -1) {
                        repeat = $scope.calendar.customRepeat;
                    }
                    var caution = $scope.calendar.caution;
                    var usernameArray = [];
                    for (var i = 0; i < $scope.participants.length; i++) {
                        usernameArray.push($scope.participants[i].Username);
                    }
                    $scope.alertMessage = "";
                    $scope.isLoading = true;
                    ClockService.save({
                        'user': currentUser.getUsername(),
                        'content': $scope.calendar.Content,
                        'repeat': repeat,
                        'caution': $scope.calendar.caution,
                        'participants': null
                    })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                            }, function (error) {
                                $scope.alertMessage = "提示：保存时钟失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            }); ;
                }

            } ]);

});