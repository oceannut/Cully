'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/utils');
    require('./log-services');
    require('../../auth/js/auth-models');
    require('../../common/js/common-cache');

    angular.module('project.log.controllers', ['utils', 'log.services', 'auth.models', 'common.cache'])
        .controller('ProjectLogListCtrl', ['$scope', '$routeParams', '$log', 'currentUser', 'dateUtil', 'stringUtil', 'categoryCache', 'userCache', 'LogOfProjectService',
            function ($scope, $routeParams, $log, currentUser, dateUtil, stringUtil, categoryCache, userCache, LogOfProjectService) {

                $scope.init = function () {
                    $scope.projectId = $routeParams.projectId;

                    $scope.query();
                }

                $scope.query = function () {
                    var currentUsername = currentUser.getUsername();
                    LogOfProjectService.query({
                        'projectId': $scope.projectId
                    })
                    .$promise
                        .then(function (result) {
                            $scope.logList = result;
                            if ($scope.logList != null) {
                                var len = $scope.logList.length;
                                for (var i = 0; i < len; i++) {
                                    var log = $scope.logList[i];
                                    categoryCache.get('log', log.Category, function (e) {
                                        if (e != null) {
                                            log.icon = e.Icon;
                                            log.categoryName = e.Name;
                                        }
                                    });
                                    userCache.get(log.Creator, function (e) {
                                        log.creatorName = (e == null) ? log.Creator : e.Name;
                                    });
                                    var content = stringUtil.removeHTML(log.Content);
                                    log.filterContent = (content != null && content.length > 108) ? content.substring(0, 108) + "..." : content;
                                    if (currentUsername === log.Creator) {
                                        log.isEidtable = true;
                                    } else {
                                        log.isEidtable = false;
                                    }
                                }
                            }
                        }, function (error) {
                            $log.error(error);
                        });
                }

            } ]);

});