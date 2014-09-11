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

    require('../../../static/js/utils');

    angular.module('calendar.controllers', ['utils'])
        .controller('CalendarSummaryCtrl', ['$scope', '$location', '$log',
            function ($scope, $location, $log) {

                $scope.init = function () {

                    var options = {
                        events_source: 'events.json.php',
                        language: 'zh-CN',
                        view: 'month',
                        tmpl_cache: false,
                        day: '2013-03-12',
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
                            $('.text-blue i').text(' ' + this.getTitle());
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
        .controller('CalendarEditCtrl', ['$scope', '$location', '$log', 'dateUtil',
            function ($scope, $location, $log, dateUtil) {

                $scope.init = function () {

                    $scope.isBusy = false;
                    $scope.calendar = {
                        Appointed: dateUtil.formatDateByYMD(new Date()),
                        Level: 1,
                        IsAlert: true,
                        isAlertMore: false
                    };

                }

            } ]);

});