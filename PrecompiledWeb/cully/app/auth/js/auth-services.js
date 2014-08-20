'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('auth.services', ['ngResource', 'configs'])
        .constant("signWcfService", "/wcf/SignWcfService.svc")
        .factory('SignInService', ['$resource', 'wcfApp', 'signWcfService',
            function ($resource, wcfApp, signWcfService) {
                return $resource(wcfApp + signWcfService + '/signin/:username/', {}, {
                    save: { method: 'POST', params: { 'username': '@username', 'pwd': '@pwd' } }
                });
            } ])
        .factory('SignUpService', ['$resource', 'wcfApp', 'signWcfService',
            function ($resource, wcfApp, signWcfService) {
                return $resource(wcfApp + signWcfService + '/signup/:username/', {}, {
                    save: { method: 'POST', params: { 'username': '@username', 'pwd': '@pwd', 'name': '@name' } }
                });
            } ])
        .factory('SignUpService2', ['$http', 'wcfApp', 'signWcfService',
            function ($http, wcfApp, signWcfService) {
                return {
                    isUsernameExist: function (username, successCallback, errorCallback) {
                        $http({ method: 'GET', url: wcfApp + signWcfService + '/signup/' + username + '/' }).
                            success(function (data, status) {
                                if (successCallback != null) {
                                    successCallback(data, status);
                                }
                            }).
                            error(function (data, status) {
                                if (errorCallback != null) {
                                    errorCallback(data, status);
                                }
                            });
                    }
                }
            } ]);

});