'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('category.services', ['ngResource', 'configs'])
        .constant("categoryWcfService", "/wcf/CategoryWcfService.svc")
        .factory('CategoryConfigService', ['$resource',
            function ($resource) {
                return $resource('config/categories.json/', {}, {
                    query: { method: 'GET', params: { }, isArray: true }
                });
            } ])
        .factory('CategoryListService', ['$resource', 'wcfApp', 'categoryWcfService',
            function ($resource, wcfApp, categoryWcfService) {
                return $resource(wcfApp + categoryWcfService + '/category/:scope/', {}, {
                    query: { method: 'GET', params: { 'scope': '@scope' }, isArray: true }
                });
            } ])
        .factory('UsedCategoryListService', ['$resource', 'wcfApp', 'categoryWcfService',
            function ($resource, wcfApp, categoryWcfService) {
                return $resource(wcfApp + categoryWcfService + '/category/:scope/used/', {}, {
                    query: { method: 'GET', params: { 'scope': '@scope' }, isArray: true }
                });
            } ])
        .factory('CodeCategoryService', ['$resource', 'wcfApp', 'categoryWcfService',
            function ($resource, wcfApp, categoryWcfService) {
                return $resource(wcfApp + categoryWcfService + '/category/:scope/code/:code/', {}, {
                    get: { method: 'GET', params: { 'scope': '@scope', 'code': '@code' } }
                });
            } ])
        .factory('CategoryService', ['$resource', 'wcfApp', 'categoryWcfService',
            function ($resource, wcfApp, categoryWcfService) {
                return $resource(wcfApp + categoryWcfService + '/category/:scope/:id/', {}, {
                    save: { method: 'POST', params: { 'scope': '@scope', 'id': '0', 'parentId': '@parentId', 'name': '@name', 'code': '@code', 'description': '@description', 'icon': '@icon', 'sequence': '@sequence'} },
                    update: { method: 'PUT', params: { 'scope': '@scope', 'id': '@id', 'parentId': '@parentId', 'name': '@name', 'code': '@code', 'description': '@description', 'icon': '@icon', 'sequence': '@sequence'} },
                    remove: { method: 'DELETE', params: { 'scope': '@scope', 'id': '@id'} },
                    get: { method: 'GET', params: { 'scope': '@scope', 'id': '@id'} }
                });
            } ])
        .factory('DisusedCategoryService', ['$resource', 'wcfApp', 'categoryWcfService',
            function ($resource, wcfApp, categoryWcfService) {
                return $resource(wcfApp + categoryWcfService + '/category/:scope/:id/disused/:disused/', {}, {
                    update: { method: 'PUT', params: { 'scope': '@scope', 'id': '@id', 'disused': '@disused'} }
                });
            } ]);

});