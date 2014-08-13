'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('comment.services', ['ngResource', 'configs'])
        .constant("commentWcfService", "/wcf/CommentWcfService.svc")
        .factory('CommentListService', ['$resource', 'wcfApp', 'commentWcfService',
            function ($resource, wcfApp, commentWcfService) {
                return $resource(wcfApp + commentWcfService + '/:user/comment/:commentTarget/:targetId/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'commentTarget': '@commentTarget', 'targetId': '@targetId' }, isArray: true }
                });
            } ])
        .factory('CommentService', ['$resource', 'wcfApp', 'commentWcfService',
            function ($resource, wcfApp, commentWcfService) {
                return $resource(wcfApp + commentWcfService + '/:user/comment/:id/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'id': '@id', 'content': '@content' }, isArray: false }
                });
            } ]);

});