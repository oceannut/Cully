'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./schedule-services');

    angular.module('schedule.controllers', ['filters', 'utils', 'schedule.services'])
        .controller('ScheduleListCtrl', ['$scope', '$location', '$log', 'currentUser', 'ScheduleListService', 'ScheduleService', 'dateUtil',
            function ($scope, $location, $log, currentUser, ScheduleListService, ScheduleService, dateUtil) {

                function load() {
                    $scope.alertMessageVisible = 'hidden';

                    ScheduleListService.query()
                        .$promise
                            .then(function (result) {
                                $scope.schedulerList = result;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：获取工作调度失败";
                                $log.error(error);
                            });
                }

                function change(scheduler, start) {
                    $scope.alertMessageVisible = 'hidden';

                    ScheduleService.update({ 'name': scheduler.Name, 'state': start })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.schedulerList) {
                                    if (result.Name === $scope.schedulerList[i].Name) {
                                        $scope.schedulerList[i] = result;
                                        break;
                                    }
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：修改工作调度失败";
                                $log.error(error);
                            });
                }

                $scope.init = function () {
                    load();
                }

                $scope.refresh = function () {
                    load();
                }

                $scope.changeState = function (item) {
                    if (item.State === 0) {
                        change(item, true);
                    } else if (item.State === 1) {
                        change(item, false);
                    } else if (item.State === 2) {
                        alert("调度正在运行，请稍后再操作。");
                    } else if (item.State === 3) {
                        change(item, true);
                    }
                }

            } ]);

});