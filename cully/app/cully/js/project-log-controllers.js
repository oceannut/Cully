'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/utils');
    require('./log-services');
    require('../../auth/js/auth-models');
    require('../../common/js/common-cache');

    angular.module('project.log.controllers', ['utils', 'log.services', 'auth.models', 'common.cache'])
        .controller('ProjectLogListCtrl', ['$scope', '$routeParams', '$log', 'currentUser', 'dateUtil', 'stringUtil', 'commonUtil',
                                            'logFace', 'faceCache', 'LogOfProjectService', 'logUtil',
            function ($scope, $routeParams, $log, currentUser, dateUtil, stringUtil, commonUtil,
                        logFace, faceCache, LogOfProjectService, logUtil) {

                $scope.init = function () {
                    var reload = $routeParams.reload;
                    $scope.logList = [];
                    $scope.projectId = $routeParams.projectId;
                    if (reload === 'true') {
                        $scope.query();
                    } else {
                        faceCache.pull(logFace, $scope.logList);
                    }
                }

                $scope.query = function () {
                    $scope.logList.length = 0;
                    $scope.alertMessage = '';
                    LogOfProjectService.query({
                        'projectId': $scope.projectId
                    })
                    .$promise
                        .then(function (result) {
                            faceCache.init(logFace, result);
                            if (result !== null) {
                                var len = result.length;
                                for (var i = 0; i < len; i++) {
                                    var item = result[i];
                                    logUtil.renderLog(item);
                                    $scope.logList.push(item);
                                }
                            }
                        }, function (error) {
                            $log.error(error);
                            $scope.alertMessage = "提示：项目列表加载失败";
                        });
                }

            } ]);

});