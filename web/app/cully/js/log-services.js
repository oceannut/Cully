'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('log.services', ['ngResource', 'configs'])
        .constant("logWcfService", "/wcf/LogWcfService.svc")
        .factory('LogService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/:user/log/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'date': '@date', 'content': '@content', 'tag1': '@tag1', 'tag2': '@tag2', 'tag3': '@tag3' }, isArray: false }
                });
            } ])
        .factory('LogUpdateService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/:user/log/:id/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'date': '@date', 'content': '@content', 'tag1': '@tag1', 'tag2': '@tag2', 'tag3': '@tag3' }, isArray: false }
                });
            } ])
        .factory('LogListService4User', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/:user/log/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('LogListService4UserByDate', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/:user/log/time/:date/:span/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('LogListService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/log/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ])
        .factory('LogListServiceByDate', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/log/time/:date/:span/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ]);
    //        .factory('CommentService', ['$resource', 'wcfApp', 'logWcfService',
    //            function ($resource, wcfApp, logWcfService) {
    //                return $resource(wcfApp + logWcfService + '/:user/log/:logId/comment/', {}, {
    //                    save: { method: 'POST', params: { 'user': '@user', 'logId': '@logId', 'content': '@content' }, isArray: false },
    //                    query: { method: 'GET', params: { 'user': '@user', 'logId': '@logId' }, isArray: true }
    //                });
    //            } ])
    //        .factory('CommentUpdateService', ['$resource', 'wcfApp', 'logWcfService',
    //            function ($resource, wcfApp, logWcfService) {
    //                return $resource(wcfApp + logWcfService + '/:user/comment/:id/', {}, {
    //                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'content': '@content' }, isArray: false }
    //                });
    //            } ]);

});