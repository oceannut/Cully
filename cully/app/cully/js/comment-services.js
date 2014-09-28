'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('comment.services', ['ngResource', 'configs'])
        .constant("commentWcfService", "/wcf/CommentWcfService.svc")
        .factory('CommentListService', ['$resource', 'wcfApp', 'commentWcfService',
            function ($resource, wcfApp, commentWcfService) {
                return $resource(wcfApp + commentWcfService + '/comment/:commentTarget/:targetId/', {}, {
                    query: { method: 'GET', params: { 'commentTarget': '@commentTarget', 'targetId': '@targetId' }, isArray: true }
                });
            } ])
        .factory('CommentService', ['$resource', 'wcfApp', 'commentWcfService',
            function ($resource, wcfApp, commentWcfService) {
                return $resource(wcfApp + commentWcfService + '/comment/:id/', {}, {
                    update: { method: 'PUT', params: { 'id': '@id', 'content': '@content' } }
                });
            } ]);

});