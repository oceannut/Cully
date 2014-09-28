'use strict';

define(function (require) {

    require('ng');
    require('ng-resource');
    require('../../../static/js/configs');

    angular.module('fileTransfer.services', ['ngResource', 'configs'])
        .constant("fileTransferWcfService", "/wcf/FileTransferWcfService.svc")
        .factory('UploadService', ['$resource', 'wcfApp', 'fileTransferWcfService',
            function ($resource, wcfApp, fileTransferWcfService) {
                return $resource(wcfApp + fileTransferWcfService + '/upload/', {}, {
                    remove: { method: 'PUT', params: { 'uploadFile': '@uploadFile'} }
                });
            } ])
        .factory('UploadLogService', ['$resource', 'wcfApp', 'fileTransferWcfService',
            function ($resource, wcfApp, fileTransferWcfService) {
                return $resource(wcfApp + fileTransferWcfService + '/uploadLog/:id/', {}, {
                    save: { method: 'POST', params: { 'id': '0', 'user': '@user', 'uploadFiles': '@uploadFiles' }, isArray: true },
                    update: { method: 'PUT', params: { 'id': '@id'} }
                });
            } ])
        .factory('UploadLogListService', ['$resource', 'wcfApp', 'fileTransferWcfService',
            function ($resource, wcfApp, fileTransferWcfService) {
                return $resource(wcfApp + fileTransferWcfService + '/uploadLog/:user/time/:date/:span/range/:start/:count/', {}, {
                    save: { method: 'GET', params: { 'user': '@user', 'date': '@date', 'span': 'span', 'start': '@start', 'count': '@count' }, isArray: true }
                });
            } ]);

});