'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('log.services', ['ngResource', 'configs'])
        .constant("logWcfService", "/wcf/LogWcfService.svc")
        .factory('LogService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/log/:id/', {}, {
                    save: { method: 'POST', params: { 'id': '0', 'user': '@user', 'projectId': '@projectId', 'title': '@title', 'content': '@content', 'category': '@category', 'tag1': '@tag1', 'tag2': '@tag2', 'tag3': '@tag3'} },
                    update: { method: 'PUT', params: { 'id': '@id', 'title': '@title', 'content': '@content', 'category': '@category', 'tag1': '@tag1', 'tag2': '@tag2', 'tag3': '@tag3'} }
                });
            } ])
        .factory('LogListService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/log/time/:date/:span/:creator/:category/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'date': '@date', 'span': '@span', 'creator': '@creator', 'category': '@category', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('LogListService2', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/log/:year/:month/:projectId/', {}, {
                    query: { method: 'GET', params: { 'year': '@year', 'month': '@month', 'projectId': '@projectId' }, isArray: true }
                });
            } ])
        .factory('CommentOfLogService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/log/:id/comment/:commentId/', {}, {
                    save: { method: 'POST', params: { 'id': '@id', 'commentId': '0', 'user': '@user', 'content': '@content'} },
                    remove: { method: 'DELETE', params: { 'id': '@id', 'commentId': '@commentId'} }
                });
            } ]);

});