'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('idiom.services', ['ngResource', 'configs'])
        .constant("idiomWcfService", "/wcf/IdiomWcfService.svc")
        .factory('IdiomConfigService', ['$resource',
            function ($resource) {
                return $resource('config/idioms.json/', {}, {
                    query: { method: 'GET', params: {}, isArray: true }
                });
            } ])
        .factory('IdiomService', ['$resource', 'wcfApp', 'idiomWcfService',
            function ($resource, wcfApp, idiomWcfService) {
                return $resource(wcfApp + idiomWcfService + '/idiom/:scope/:id/', {}, {
                    save: { method: 'POST', params: { 'scope': '@scope', 'id': '0', 'content': '@content'} },
                    update: { method: 'PUT', params: { 'scope': '@scope', 'id': '@id', 'content': '@content'} },
                    remove: { method: 'DELETE', params: { 'scope': '@scope', 'id': '@id'} }
                });
            } ])
        .factory('IdiomListService', ['$resource', 'wcfApp', 'idiomWcfService',
            function ($resource, wcfApp, idiomWcfService) {
                return $resource(wcfApp + idiomWcfService + '/idiom/:scope/', {}, {
                    query: { method: 'GET', params: { 'scope': '@scope' }, isArray: true }
                });
            } ]);

});