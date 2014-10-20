'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('calendar.services', ['ngResource', 'configs'])
        .constant("calendarWcfService", "/wcf/CalendarWcfService.svc")
        .constant("cautionCalendarWcfService", "/wcf/CautionCalendarWcfService.svc")
        .factory('CalendarService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/calendar/:id/', {}, {
                    save: { method: 'POST', params: { 'id': '0', 'user': '@user', 'projectId': '@projectId', 'appointed': '@appointed', 'endAppointed': '@endAppointed', 'content': '@content', 'level': '@level', 'repeat': '@repeat', 'caution': '@caution', 'isCaution': '@isCaution', 'participants': '@participants'} },
                    update: { method: 'PUT', params: { 'id': '@id', 'appointed': '@appointed', 'endAppointed': '@endAppointed', 'content': '@content', 'level': '@level', 'repeat': '@repeat', 'caution': '@caution', 'isCaution': '@isCaution'} },
                    remove: { method: 'DELETE', params: { 'id': '@id'} },
                    get: { method: 'GET', params: { 'id': '@id'} }
                });
            } ])
        .factory('CalendarService4UpdateCaution', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/calendar/:id/caution/:isCaution/', {}, {
                    update: { method: 'PUT', params: { 'id': '@id', 'isCaution': '@isCaution'} }
                });
            } ])
        .factory('CalendarListService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/calendar/:year/:month/:type/:user/', {}, {
                    query: { method: 'GET', params: { 'year': '@year', 'month': '@month', 'type': '@type', 'user': '@user' }, isArray: true }
                });
            } ])
        .factory('CalendarOfProjectService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/project/:projectId/calendar/', {}, {
                    query: { method: 'GET', params: { 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('CalendarOfCautionService', ['$resource', 'wcfApp', 'cautionCalendarWcfService',
            function ($resource, wcfApp, cautionCalendarWcfService) {
                return $resource(wcfApp + cautionCalendarWcfService + '/calendar/:year/:month/:day/:user/caution/', {}, {
                    query: { method: 'GET', params: { 'year': '@year', 'month': '@month', 'day': '@day', 'user': '@user' }, isArray: true }
                });
            } ])
        .factory('ClockService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/clock/:id/', {}, {
                    save: { method: 'POST', params: { 'id': '0', 'user': '@user', 'content': '@content', 'repeat': '@repeat', 'caution': '@caution', 'participants': '@participants'} },
                    update: { method: 'PUT', params: { 'id': '@id', 'content': '@content', 'repeat': '@repeat', 'caution': '@caution', 'isCaution': '@isCaution'} }
                });
            } ])
        .factory('CalendarCautionService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/calendar/:calendarId/caution/:participant/', {}, {
                    save: { method: 'POST', params: { 'calendarId': '@calendarId', 'participant': '@participant'} },
                    remove: { method: 'DELETE', params: { 'calendarId': '@calendarId', 'participant': '@participant'} }
                });
            } ])
        .factory('CalendarCautionListService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/calendar/:calendarId/caution/', {}, {
                    query: { method: 'GET', params: { 'calendarId': '@calendarId' }, isArray: true }
                });
            } ]);

});