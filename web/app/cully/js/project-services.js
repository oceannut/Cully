'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('project.services', ['ngResource', 'configs'])
        .constant("projectWcfService", "/wcf/ProjectWcfService.svc")
        .factory('ProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/:projectId/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'projectId': '0', 'name': '@name', 'description': '@description', 'participants': '@participants' } },
                    update: { method: 'PUT', params: { 'user': '@user', 'projectId': '@projectId', 'name': '@name', 'description': '@description' } },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'projectId': '@projectId' } },
                    get: { method: 'GET', params: { 'user': '@user', 'projectId': '@projectId' } }
                });
            } ])
        .factory('TopProjectListService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/top/isSoloInclude/:isSoloInclude/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'isSoloInclude': '@isSoloInclude', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('ProjectListService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/isSoloInclude/:isSoloInclude/time/:date/:span/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'isSoloInclude': '@isSoloInclude', 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('ActivityListService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/0/activity/category/:category/time/:date/:span/range/:start/:count/', {}, {
                    query1: { method: 'GET', params: { 'user': '@user', 'category': 'null', 'date': 'null', 'span': 'null', 'start': '@start', 'count': '@count' }, isArray: true },
                    query2: { method: 'GET', params: { 'user': '@user', 'category': 'null', 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true },
                    query3: { method: 'GET', params: { 'user': '@user', 'category': '@category', 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('ActivityService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/:projectId/activity/:activityId/', {}, {
                    saveSolo: { method: 'POST', params: { 'user': '@user', 'projectId': '0', 'activityId': '0', 'category': '@category', 'name': '@name', 'description': '@description', 'participants': '@participants' } },
                    save: { method: 'POST', params: { 'user': '@user', 'projectId': '@projectId', 'activityId': '0', 'category': '@category', 'name': '@name', 'description': '@description'} },
                    update: { method: 'PUT', params: { 'user': '@user', 'projectId': '0', 'activityId': '@activityId', 'category': '@category', 'name': '@name', 'description': '@description'} },
                    get: { method: 'GET', params: { 'user': '@user', 'projectId': '0', 'activityId': '@activityId' }, isArray: false }
                });
            } ])
        .factory('ActivityOfProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/:projectId/activity/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('ParticipantService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/:projectId/participant/:participant/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'projectId': '@projectId', 'participant': '@participant'}, isArray: false },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'projectId': '@projectId', 'participant': '@participant' }, isArray: false }
                });
            } ])
        .factory('ParticipantOfProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/:projectId/participant/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'projectId': '@projectId' }, isArray: true }
                });
            } ]);

});