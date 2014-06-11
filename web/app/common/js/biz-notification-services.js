'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('bizNotification.services', ['ngResource', 'configs'])
        .constant("bizNotificationWcfService", "/wcf/BizNotificationWcfService.svc")
        .factory('BizNotificationService', ['$resource', 'wcfApp', 'bizNotificationWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/notification/biz/inbox/:user/untreated/', {}, {
                    query: { method: 'GET', params: { 'user': '@user' }, isArray: true }
                });
            } ]);

});