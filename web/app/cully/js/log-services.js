'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('log.services', ['ngResource', 'configs'])
        .constant("logWcfService", "/wcf/LogWcfService.svc")
        .factory('LogService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/log/:date/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'date': '@date', 'content': '@content' }, isArray: false },
                });
            } ])
        .factory('LogListService4User', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/log/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'start': '@start', 'count': '@count' }, isArray: true },
                });
            } ])
        .factory('LogListService4UserByDate', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/:user/log/time/:date/:span/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true },
                });
            } ])
        .factory('LogListService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/log/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'start': '@start', 'count': '@count' }, isArray: true },
                });
            } ])
        .factory('LogListServiceByDate', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, taskWcfService) {
                return $resource(wcfApp + taskWcfService + '/log/time/:date/:span/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'date': '@date', 'span': '@span', 'start': '@start', 'count': '@count' }, isArray: true },
                });
            } ]);

});