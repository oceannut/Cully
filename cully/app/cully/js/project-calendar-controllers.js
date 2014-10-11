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

    angular.module('project.calendar.controllers', ['utils', 'auth.models', 'calendar.services'])
        .controller('ProjectCalendarListCtrl', ['$scope', '$routeParams', '$log', 'dateUtil', 'currentUser', 'CalendarOfProjectService',
            function ($scope, $routeParams, $log, dateUtil, currentUser, CalendarOfProjectService) {

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
                    $scope.projectId = $routeParams.projectId;
                    $scope.query();
                }

                $scope.query = function () {
                    $scope.calendarList = null;
                    CalendarOfProjectService.query({
                        'projectId': $scope.projectId
                    })
                    .$promise
                        .then(function (result) {
                            $scope.calendarList = result;
                            renderList();
                        }, function (error) {
                            $log.error(error);
                        });
                }

            } ]);

});