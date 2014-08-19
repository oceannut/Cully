'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('notice.services', ['ngResource', 'configs'])
        .constant("noticeWcfService", "/wcf/NoticeWcfService.svc")
        .factory('NoticeService', ['$resource', 'wcfApp', 'noticeWcfService',
            function ($resource, wcfApp, noticeWcfService) {
                return $resource(wcfApp + noticeWcfService + '/notice/:id/', {}, {
                    save: { method: 'POST', params: { 'id': '0', 'title': '@title', 'content': '@content', 'creator': '@creator'} },
                    update: { method: 'PUT', params: { 'id': '@id', 'title': '@title', 'content': '@content', 'creator': '@creator'} },
                    remove: { method: 'DELETE', params: { 'id': '@id', 'creator': '@creator'} },
                    get: { method: 'GET', params: { 'id': '@id'} }
                });
            } ])
        .factory('NoticeListService', ['$resource', 'wcfApp', 'noticeWcfService',
            function ($resource, wcfApp, noticeWcfService) {
                return $resource(wcfApp + noticeWcfService + '/notice/time/:date/:span/range/:start/:count/', {}, {
                    query: { method: 'GET', params: { 'date': '@date', 'span': 'span', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ]);

});