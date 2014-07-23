'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('bizNotification.services', ['ngResource', 'configs'])
        .constant("bizNotificationWcfService", "/wcf/BizNotificationWcfService.svc")
        .factory('UntreatedBizNotificationService', ['$resource', 'wcfApp', 'bizNotificationWcfService',
            function ($resource, wcfApp, bizNotificationWcfService) {
                return $resource(wcfApp + bizNotificationWcfService + '/notification/biz/inbox/:user/untreated/', {}, {
                    query: { method: 'GET', params: { 'user': '@user' }, isArray: true }
                });
            } ])
        .factory('BizNotificationService4Resource', ['$resource', 'wcfApp', 'bizNotificationWcfService',
            function ($resource, wcfApp, bizNotificationWcfService) {
                return $resource(wcfApp + bizNotificationWcfService + '/notification/biz/both/:user/resource/:resource/resourceId/:resourceId/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'resource': '@resource', 'resourceId': '@resourceId' }, isArray: true }
                });
            } ]);

});