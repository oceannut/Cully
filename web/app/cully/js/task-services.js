'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('task.services', ['ngResource', 'configs'])
        .constant("taskWcfService", "/wcf/TaskWcfService.svc")
        .factory('TaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/:id/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'activityId': '@activityId', 'id': '0', 'staff': '@staff', 'content': '@content', 'appointedDay': '@appointedDay'} },
                    update: { method: 'PUT', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id', 'staff': '@staff', 'content': '@content', 'appointedDay': '@appointedDay'} },
                    get: { method: 'GET', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id' }, isArray: false }
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
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/:id/isUnderway/:isUnderway/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id', 'isUnderway': '@isUnderway'} }
                });
            } ])
        .factory('Update4IsCompletedTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/:id/isCompleted/:isCompleted/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id', 'isCompleted': '@isCompleted'} }
                });
            } ])
        .factory('Update4CommentTaskService', ['$resource', 'wcfApp', 'taskWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/task/:activityId/:id/comment/:commentId/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id', 'commentId': '0', 'content': '@content', 'observers': '@observers' } },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'activityId': '@activityId', 'id': '@id', 'commentId': '@commentId', 'observers': '@observers'} }
                });
            } ]);

});