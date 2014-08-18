'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('bizNotification.services', ['ngResource', 'configs'])
        .constant("bizNotificationWcfService", "/wcf/BizNotificationWcfService.svc")
        .factory('UntreatedBizNotificationService', ['$resource', 'wcfApp', 'bizNotificationWcfService',
            function ($resource, wcfApp, bizNotificationWcfService) {
                return $resource(wcfApp + bizNotificationWcfService + '/notification/biz/inbox/:user/untreated/:notificationId/', {}, {
                    update: { method: 'PUT', params: { 'user': '@user', 'notificationId': '@notificationId'} }
                });
            } ])
        .factory('UntreatedBizNotificationListService', ['$http', 'wcfApp', 'bizNotificationWcfService',
            function ($http, wcfApp, bizNotificationWcfService) {
                return {
                    list: function (username) {
                        return $http({ method: 'GET', url: wcfApp + bizNotificationWcfService + '/notification/biz/inbox/' + username + '/untreated/list/' });
                    },
                    count: function (username) {
                        return $http({ method: 'GET', url: wcfApp + bizNotificationWcfService + '/notification/biz/inbox/' + username + '/untreated/count/' });
                    }
                }
            } ])
        .factory('BizNotificationService4Resource', ['$resource', 'wcfApp', 'bizNotificationWcfService',
            function ($resource, wcfApp, bizNotificationWcfService) {
                return $resource(wcfApp + bizNotificationWcfService + '/notification/biz/both/:user/resource/:resource/resourceId/:resourceId/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'resource': '@resource', 'resourceId': '@resourceId' }, isArray: true }
                });
            } ]);

});