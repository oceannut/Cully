'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('user.services', ['ngResource', 'configs'])
        .constant("userWcfService", "/wcf/UserWcfService.svc")
        .factory('UserService', ['$resource', 'wcfApp', 'userWcfService',
            function ($resource, wcfApp, userWcfService) {
                return $resource(wcfApp + userWcfService + '/user/:username/', {}, {
                    get: { method: 'GET', params: { 'username': '@username' }, isArray: false }
                });
            } ])
        .factory('UserListService', ['$resource', 'wcfApp', 'userWcfService',
            function ($resource, wcfApp, userWcfService) {
                return $resource(wcfApp + userWcfService + '/user/', {}, {
                    query: { method: 'GET', params: { }, isArray: true }
                });
            } ]);

});