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

    require('./calendar-services');

    angular.module('calendar.controllers', ['utils', 'auth.models', 'calendar.services'])
        .controller('CalendarSummaryCtrl', ['$scope', '$routeParams', '$log', 'dateUtil', 'CalendarListService',
            function ($scope, $routeParams, $log, dateUtil, CalendarListService) {

                $scope.init = function () {

                    var dateString = $routeParams.day;
                    if (undefined === dateString || 'null' === dateString) {
                        dateString = dateUtil.formatDateByYMD(new Date());
                    }
                    var dateArray = dateString.split('-');
                    console.log(dateArray);
                    var year = dateArray[0];
                    var month = dateArray[1];
                    CalendarListService.query({ 'year': year, 'month': month })
                            .$promise
                                .then(function (result) {
                                    console.log(result);
                                }, function (error) {
                                    $log.error(error);
                                });

                    var options = {
                        events_source: 'events.json.php',
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
                            var list = $('#eventlist');
                            list.html('');

                            $.each(events, function (key, val) {
                                $(document.createElement('li'))
                            		.html('<a href="' + val.url + '">' + val.title + '</a>')
                            		.appendTo(list);
                            });
                        },
                        onAfterViewLoad: function (view) {
                            $('.text-red i').text(' ' + this.getTitle());
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

                }

            } ])
        .controller('CalendarListCtrl', ['$scope', '$routeParams', '$log', 'dateUtil',
            function ($scope, $routeParams, $log, dateUtil) {

                $scope.init = function () {
                    $scope.projectId = $routeParams.projectId;

                }

            } ])
        .controller('CalendarEditCtrl', ['$scope', '$routeParams', '$log', '$location', 'dateUtil', 'currentUser', 'CalendarService',
            function ($scope, $routeParams, $log, $location, dateUtil, currentUser, CalendarService) {

                $scope.init = function () {
                    $scope.projectId = $routeParams.projectId;
                    $scope.isBusy = false;
                    var timestamp = new Date();
                    var hour = (timestamp.getHours() + 1) % 24;
                    $scope.calendar = {
                        Appointed: dateUtil.formatDateByYMD(timestamp),
                        Level: 1,
                        Repeat: 0,
                        isAlert: true,
                        caution: (hour < 10 ? '0' + hour : hour) + ':00',
                        isMoreParticipants: false
                    };
                    if ($scope.projectId > 0) {
                        $scope.calendar.isBindProject = true;
                    } else {
                        $scope.calendar.isBindProject = false;
                    }

                }

                $scope.gotoCalendarSummary = function () {
                    $location.path('/calendar-summary/' + $scope.calendar.Appointed + '/');
                }

                $scope.save = function () {
                    CalendarService.save({
                        'user': currentUser.getUsername(),
                        'projectId': $scope.projectId,
                        'appointed': $scope.calendar.Appointed,
                        'content': $scope.calendar.Content,
                        'level': $scope.calendar.Level,
                        'repeat': $scope.calendar.Repeat,
                        'caution': $scope.calendar.caution,
                        'participants': null
                    })
                        .$promise
                            .then(function (result) {
                                console.log(result);
                            }, function (error) {
                                $log.error(error);
                            });
                }

            } ]);

});