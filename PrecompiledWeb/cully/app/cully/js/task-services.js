'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('task.services', ['ngResource', 'configs'])
        .constant("taskWcfService", "/wcf/TaskWcfService.svc")
        .factory('TaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/:id/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'activityId': '@activityId', 'id': '0', 'content': '@content', 'staff': '@staff', 'appointedDay': '@appointedDay'} },
                    update: { method: 'PUT', params: { 'user': '@user', 'activityId': '0', 'id': '@id', 'content': '@content', 'staff': '@staff', 'appointedDay': '@appointedDay'} },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'activityId': '0', 'id': '@id' } },
                    get: { method: 'GET', params: { 'user': '@user', 'activityId': '0', 'id': '@id' }, isArray: false }
                });
            } ])
        .factory('TaskListService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'activityId': '@activityId' }, isArray: true }
                });
            } ])
        .factory('Update4IsUnderwayTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/0/:id/isUnderway/:isUnderway/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'isUnderway': '@isUnderway'} }
                });
            } ])
        .factory('Update4IsCompletedTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/0/:id/isCompleted/:isCompleted/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'isCompleted': '@isCompleted'} }
                });
            } ])
        .factory('Update4CommentTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/0/:id/comment/:commentId/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'id': '@id', 'commentId': '0', 'content': '@content', 'observers': '@observers' } },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'id': '@id', 'commentId': '@commentId', 'observers': '@observers'} }
                });
            } ])
        .factory('ActivityTaskDelayListService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/taskDelay/:date/:activityId/:includeDones/', {}, {
                    query: { method: 'GET', params: { 'date': '@date', 'activityId': '@activityId', 'includeDones': '@includeDones' }, isArray: true }
                });
            } ]);

});