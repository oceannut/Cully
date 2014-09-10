'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('schedule.services', ['ngResource', 'configs'])
        .constant("scheduleWcfService", "/wcf/ScheduleWcfService.svc")
        .factory('ScheduleListService', ['$resource', 'wcfApp', 'scheduleWcfService',
            function ($resource, wcfApp, scheduleWcfService) {
                return $resource(wcfApp + scheduleWcfService + '/schedule/', {}, {
                    query: { method: 'GET', params: {}, isArray: true }
                });
            } ])
        .factory('ScheduleService', ['$resource', 'wcfApp', 'scheduleWcfService',
            function ($resource, wcfApp, scheduleWcfService) {
                return $resource(wcfApp + scheduleWcfService + '/schedule/:name/:state/', {}, {
                    update: { method: 'POST', params: { 'name': '@name', 'state': '@state' } }
                });
            } ]);

});