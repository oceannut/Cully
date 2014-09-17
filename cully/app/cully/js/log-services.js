'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('log.services', ['ngResource', 'configs'])
        .constant("logWcfService", "/wcf/LogWcfService.svc")
        .factory('LogService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/:user/log/:id/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'id': '0', 'projectId': '@projectId', 'title': '@title', 'content': '@content', 'category': '@category', 'tag1': '@tag1', 'tag2': '@tag2', 'tag3': '@tag3'} },
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'title': '@title', 'content': '@content', 'category': '@category', 'tag1': '@tag1', 'tag2': '@tag2', 'tag3': '@tag3'} }
                });
            } ])
        .factory('LogListService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/:user/log/time/:date/:span/:creator/:category/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'date': '@date', 'span': '@span', 'creator': '@creator', 'category': '@category', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('LogListService2', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/log/:year/:month/:projectId/', {}, {
                    query: { method: 'GET', params: { 'year': '@year', 'month': '@month', 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('Update4CommentLogService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/:user/log/:id/comment/:commentId/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'id': '@id', 'commentId': '0', 'content': '@content' } },
                    remove: { method: 'DELETE', params: { 'user': '@user', 'id': '@id', 'commentId': '@commentId'} }
                });
            } ]);

});