﻿'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('project.services', ['ngResource', 'configs'])
        .constant("projectWcfService", "/wcf/ProjectWcfService.svc")
        .factory('ProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/', {}, {
                    save: { method: 'POST', params: { 'user': '@user', 'name': '@name', 'description': '@description', 'participants': '@participants' }, isArray: false },
                    query: { method: 'GET', params: { 'user': '@user' }, isArray: true }
                });
            } ])
        .factory('TopProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/:user/project/top/:count/', {}, {
                    query: { method: 'GET', params: { 'user': '@user', 'count':'@count' }, isArray: true }
                });
            } ]);

});