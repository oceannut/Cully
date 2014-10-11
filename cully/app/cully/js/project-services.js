'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('project.services', ['ngResource', 'configs'])
        .constant("projectWcfService", "/wcf/ProjectWcfService.svc")
        .factory('ProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:projectId/', {}, {
                    save: { method: 'POST', params: { 'projectId': '0', 'user': '@user', 'name': '@name', 'description': '@description', 'participants': '@participants', 'createSameNameActivity': '@createSameNameActivity', 'category': '@category'} },
                    update: { method: 'PUT', params: { 'projectId': '@projectId', 'name': '@name', 'description': '@description' } },
                    remove: { method: 'DELETE', params: { 'projectId': '@projectId' } },
                    get: { method: 'GET', params: { 'projectId': '@projectId' } }
                });
            } ])
        .factory('TopProjectListService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:user/top/isSoloInclude/:isSoloInclude/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'isSoloInclude': '@isSoloInclude', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('ProjectListService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:user/isSoloInclude/:isSoloInclude/time/:date/:span/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'isSoloInclude': '@isSoloInclude', 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('ActivityService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/activity/:activityId/', {}, {
                    save: { method: 'POST', params: { 'activityId': '0', 'user': '@user', 'category': '@category', 'name': '@name', 'description': '@description', 'participants': '@participants'} },
                    update: { method: 'PUT', params: { 'activityId': '@activityId', 'category': '@category', 'name': '@name', 'description': '@description'} },
                    get: { method: 'GET', params: { 'activityId': '@activityId' }, isArray: false }
                });
            } ])
        .factory('ActivityListService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/activity/:user/category/:category/time/:date/:span/range/:start/:count/', {}, {
                    query3: { method: 'GET', params: { 'user': '@user', 'category': '@category', 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('ActivityOfProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:projectId/activity/', {}, {
                    save: { method: 'POST', params: { 'projectId': '@projectId', 'user': '@user', 'category': '@category', 'name': '@name', 'description': '@description'} },
                    query: { method: 'GET', params: { 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('ParticipantService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:projectId/participant/:participant/', {}, {
                    save: { method: 'POST', params: { 'projectId': '@projectId', 'participant': '@participant'}, isArray: false },
                    remove: { method: 'DELETE', params: { 'projectId': '@projectId', 'participant': '@participant' }, isArray: false }
                });
            } ])
        .factory('ParticipantOfProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:projectId/participant/', {}, {
                    query: { method: 'GET', params: { 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('AttachmentService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:projectId/attachment/:attachmentId/', {}, {
                    save: { method: 'POST', params: { 'projectId': '@projectId', 'attachmentId': '0', 'user': '@user', 'uploadFile': '@uploadFile'} },
                    remove: { method: 'DELETE', params: { 'projectId': '@projectId', 'attachmentId': '@attachmentId'} }
                });
            } ])
        .factory('AttachmentOfProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:projectId/attachment/', {}, {
                    query: { method: 'GET', params: { 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('CommentOfProjectAttachmentService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/attachment/:id/comment/:commentId/', {}, {
                    save: { method: 'POST', params: { 'id': '@id', 'commentId': '0', 'user': '@user', 'content': '@content'} },
                    remove: { method: 'DELETE', params: { 'id': '@id', 'commentId': '@commentId'} }
                });
            } ]);

});