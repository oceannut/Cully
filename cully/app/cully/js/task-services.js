'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('task.services', ['ngResource', 'configs'])
        .constant("taskWcfService", "/wcf/TaskWcfService.svc")
        .factory('TaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/task/:id/', {}, {
                    update: { method: 'PUT', params: { 'id': '@id', 'user': '@user', 'content': '@content', 'staff': '@staff', 'appointedDay': '@appointedDay'} },
                    remove: { method: 'DELETE', params: { 'id': '@id' } },
                    get: { method: 'GET', params: { 'id': '@id' }, isArray: false }
                });
            } ])
        .factory('TaskOfActivityService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/activity/:activityId/task/', {}, {
                    save: { method: 'POST', params: { 'activityId': '@activityId', 'user': '@user', 'content': '@content', 'staff': '@staff', 'appointedDay': '@appointedDay'} },
                    query: { method: 'GET', params: { 'activityId': '@activityId' }, isArray: true }
                });
            } ])
        .factory('Update4IsUnderwayTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/task/:id/isUnderway/:isUnderway/', {}, {
                    update: { method: 'PUT', params: { 'id': '@id', 'isUnderway': '@isUnderway'} }
                });
            } ])
        .factory('Update4IsCompletedTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/task/:id/isCompleted/:isCompleted/', {}, {
                    update: { method: 'PUT', params: { 'id': '@id', 'isCompleted': '@isCompleted'} }
                });
            } ])
        .factory('CommentOfTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/task/:id/comment/:commentId/', {}, {
                    save: { method: 'POST', params: { 'id': '@id', 'commentId': '0', 'user': '@user', 'content': '@content', 'observers': '@observers'} },
                    remove: { method: 'DELETE', params: { 'id': '@id', 'commentId': '@commentId', 'observers': '@observers'} }
                });
            } ])
        .factory('ActivityTaskDelayListService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/taskDelay/:date/:activityId/:includeDones/', {}, {
                    query: { method: 'GET', params: { 'date': '@date', 'activityId': '@activityId', 'includeDones': '@includeDones' }, isArray: true }
                });
            } ]);

});