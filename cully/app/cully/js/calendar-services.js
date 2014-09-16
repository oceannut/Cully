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
                    save: { method: 'POST', params: { 'user': '@user', 'id': '0', 'projectId': '@projectId', 'appointed': '@appointed', 'endAppointed': '@endAppointed', 'content': '@content', 'level': '@level', 'repeat': '@repeat', 'caution': '@caution', 'isCaution': '@isCaution', 'participants': '@participants'} },
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'appointed': '@appointed', 'endAppointed': '@endAppointed', 'content': '@content', 'level': '@level', 'repeat': '@repeat', 'caution': '@caution', 'isCaution': '@isCaution'} },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'id': '@id'} },
                    get: { method: 'GET', params: { 'user': '@user', 'id': '@id'} }
                });
            } ])
        .factory('CalendarService4UpdateCaution', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/:user/calendar/:id/caution/:isCaution/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'isCaution': '@isCaution'} }
                });
            } ])
        .factory('CalendarListService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/:user/calendar/:year/:month/:type/:projectId/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'year': '@year', 'month': '@month', 'type': '@type', 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('ClockService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/:user/clock/:id/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'id': '0', 'content': '@content', 'repeat': '@repeat', 'caution': '@caution', 'participants': '@participants'} },
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'content': '@content', 'repeat': '@repeat', 'caution': '@caution', 'isCaution': '@isCaution'} }
                });
            } ])
        .factory('CalendarCautionService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/:user/calendar/:calendarId/caution/:participant/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'calendarId': '@calendarId', 'participant': '@participant'} },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'calendarId': '@calendarId', 'participant': '@participant'} }
                });
            } ])
        .factory('CalendarCautionListService', ['$resource', 'wcfApp', 'calendarWcfService',
            function ($resource, wcfApp, calendarWcfService) {
                return $resource(wcfApp + calendarWcfService + '/:user/calendar/:id/caution/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'id': '@id' }, isArray: true }
                });
            } ]);

});