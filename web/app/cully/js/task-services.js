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
            } ]);

});