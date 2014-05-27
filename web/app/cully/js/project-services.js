'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('project.services', ['ngResource', 'configs'])
        .constant("projectWcfService", "/wcf/ProjectWcfService.svc")
        .factory('ProjectService', ['$resource', 'wcfApp', 'projectWcfService',
            function ($resource, wcfApp, projectWcfService) {
                return $resource(wcfApp + projectWcfService + '/project/:name/', {}, {
                    save: { method: 'POST', params: { 'name': '@name', 'description': '@description', 'staffs': '@staffs', 'creator': '@creator' }, isArray: false }
                });
            } ]);

});