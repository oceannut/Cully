'use strict';

define(function (require) {

    require('angular');
    require('resource');
    require('../../../static/js/configs');

    angular.module('category.services', ['ngResource', 'configs'])
        .constant("categoryWcfService", "/wcf/CategoryWcfService.svc")
        .factory('CategoryService', ['$resource', 'wcfApp', 'categoryWcfService',
            function ($resource, wcfApp, categoryWcfService) {
                return $resource(wcfApp + categoryWcfService + '/category/:scope/', {}, {
                    query: { method: 'GET', params: { 'scope': '@scope' }, isArray: true }
                });
            } ]);

});