'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('user.services', ['ngResource', 'configs'])
        .constant("userWcfService", "/wcf/UserWcfService.svc")
        .factory('UserService', ['$resource', 'wcfApp', 'userWcfService',
            function ($resource, wcfApp, userWcfService) {
                return $resource(wcfApp + userWcfService + '/user/:username/', {}, {
                    update: { method: 'PUT', params: { 'username': '@username', 'name': '@name', 'group': '@group'} },
                    remove: { method: 'DELETE', params: { 'username': '@username' } },
                    get: { method: 'GET', params: { 'username': '@username' } }
                });
            } ])
        .factory('UserListService', ['$resource', 'wcfApp', 'userWcfService',
            function ($resource, wcfApp, userWcfService) {
                return $resource(wcfApp + userWcfService + '/user/', {}, {
                    query: { method: 'GET', params: { }, isArray: true }
                });
            } ])
        .factory('UserPasswordService', ['$resource', 'wcfApp', 'userWcfService',
            function ($resource, wcfApp, userWcfService) {
                return $resource(wcfApp + userWcfService + '/user/:username/pwd/', {}, {
                    update: { method: 'PUT', params: { 'username': '@username', 'oldPwd': '@oldPwd', 'newPwd': '@newPwd'} }
                });
            } ])
        .factory('RoleConfigService', ['$resource',
            function ($resource) {
                return $resource('config/roles.json/', {}, {
                    query: { method: 'GET', params: {}, isArray: true }
                });
            } ])
        .factory('RoleService', ['$resource', 'wcfApp', 'userWcfService',
            function ($resource, wcfApp, userWcfService) {
                return $resource(wcfApp + userWcfService + '/user/:username/role/:role/', {}, {
                    save: { method: 'POST', params: { 'username': '@username', 'role': '@role'} },
                    remove: { method: 'DELETE', params: { 'username': '@username', 'role': '@role'} }
                });
            } ]);

});