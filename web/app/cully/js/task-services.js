'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('task.services', ['ngResource', 'configs'])
        .constant("taskWcfService", "/wcf/TaskWcfService.svc")
        .factory('TaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'activityId': '@activityId', 'staff': '@staff', 'content': '@content', 'appointedDay': '@appointedDay' }, isArray: false },
                    query: { method: 'GET', params: { 'user': '@user', 'activityId': '@activityId' }, isArray: true }
                });
            } ])
        .factory('UpdateTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/:id/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id', 'staff': '@staff', 'content': '@content', 'appointedDay': '@appointedDay' }, isArray: false }
                });
            } ])
        .factory('Update4IsUnderwayTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/:id/isUnderway/:isUnderway/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id', 'isUnderway': '@isUnderway' }, isArray: false }
                });
            } ])
        .factory('Update4IsCompletedTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/:id/isCompleted/:isCompleted/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id', 'isCompleted': '@isCompleted' }, isArray: false }
                });
            } ]);

});