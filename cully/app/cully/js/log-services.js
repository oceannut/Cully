'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('log.services', ['ngResource', 'configs'])
        .constant("logWcfService", "/wcf/LogWcfService.svc")
        .factory('logUtil', ['currentUser', 'stringUtil', 'commonUtil', function (currentUser, stringUtil, commonUtil) {

            function renderLog(item) {
                if (item !== undefined && item !== null) {
                    commonUtil.buildCategory(item, 'log');
                    if (item.Creator === currentUser.getUsername()) {
                        item.isEditable = true;
                    } else {
                        item.isEditable = false;
                    }
                    commonUtil.buildCreatorName(item);
                    var content = stringUtil.removeHTML(item.Content);
                    item.filterContent = (content != null && content.length > 108) ? content.substring(0, 108) + "..." : content;
                    if (item.Tags != null && item.Tags != '') {
                        item.TagList = item.Tags.split(',');
                    }
                }
            }

            return {
                renderLog: renderLog
            }

        } ])
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
        .factory('LogOfProjectService', ['$resource', 'wcfApp', 'logWcfService',
            function ($resource, wcfApp, logWcfService) {
                return $resource(wcfApp + logWcfService + '/project/:projectId/log/', {}, {
                    query: { method: 'GET', params: { 'projectId': '@projectId' }, isArray: true }
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