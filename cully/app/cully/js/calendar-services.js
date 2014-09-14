'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('calendar.services', ['ngResource', 'configs'])
        .constant("calendarWcfService", "/wcf/CalendarWcfService.svc")
        .factory('CalendarService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/:user/calendar/:id/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'id': '0', 'projectId': '@projectId', 'appointed': '@appointed', 'endAppointed': '@endAppointed', 'content': '@content', 'level': '@level', 'repeat': '@repeat', 'caution': '@caution', 'participants': '@participants'} },
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'appointed': '@appointed', 'content': '@content', 'level': '@level', 'repeat': '@repeat', 'caution': '@caution'} },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'id': '@id'} }
                });
            } ])
        .factory('CalendarListService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/calendar/:year/:month/', {}, {
                    query: { method: 'GET', params: { 'year': '@year', 'month': '@month' }, isArray: true }
                });
            } ])
        .factory('ClockService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/:user/calendar/:id/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'id': '0', 'content': '@content', 'repeat': '@repeat', 'caution': '@caution', 'participants': '@participants'} }
                });
            } ]);

});