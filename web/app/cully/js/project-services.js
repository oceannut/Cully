'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('project.services', ['ngResource', 'configs'])
        .constant("projectWcfService", "/wcf/ProjectWcfService.svc")
        .factory('ProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'name': '@name', 'description': '@description', 'participants': '@participants' }, isArray: false },
                    query: { method: 'GET', params: { 'user': '@user' }, isArray: true }
                });
            } ])
        .factory('ProjectDetailsService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/:projectId/', {}, {
                    get: { method: 'GET', params: { 'projectId': '@projectId' }, isArray: false }
                });
            } ])
        .factory('TopProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/top/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'count':'@count' }, isArray: true }
                });
            } ])
        .factory('ProjectActivityService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/0/activity/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'name': '@name', 'description': '@description', 'participants': '@participants' }, isArray: false }
                });
            } ])
        .factory('ActivityListService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/0/activity/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('ActivityService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/:projectId/activity/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'projectId': '@projectId', 'name': '@name', 'description': '@description' }, isArray: false },
                    query: { method: 'GET', params: { 'user': '@user', 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('ParticipantService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/:projectId/participant/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'projectId': '@projectId' }, isArray: true }
                });
            } ]);

});