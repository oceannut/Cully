'use strict';

define(function (require) {

    require('ng');
    require('bootstrap');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('../../auth/js/auth-models');
    require('../../common/js/common-cache');
    require('../../common/js/notice-services');

    require('../../../static/css/carousel.css');

    angular.module('home.controllers', ['filters', 'utils', 'auth.models', 'common.cache', 'notice.services'])
        .controller('HomeCtrl', ['$scope', '$location', '$log', 'currentUser', 'userCache', 'categoryCache', 'NoticeListService', 'NoticeService', 'dateUtil',
            function ($scope, $location, $log, currentUser, userCache, categoryCache, NoticeListService, NoticeService, dateUtil) {

                $scope.init = function () {

                    userCache.list();
                    categoryCache.list("activity");
                    categoryCache.list("log");

                    var span = 30;
                    var startDate = new Date();
                    startDate.setDate(startDate.getDate() - span)
                    NoticeListService.query({ 'date': dateUtil.formatDateByYMD(startDate),
                        'span': span + 1,
                        'start': 0,
                        'count': 6
                    })
                        .$promise
                            .then(function (result) {
                                $scope.noticeList = result;
                            }, function (error) {
                                $log.error("提示：获取公告列表失败");
                                $log.error(error);
                            });

                }

                $scope.showNotice = function (item) {
                    NoticeService.get({ 'id': item.Id })
                        .$promise
                            .then(function (result) {
                                $scope.notice = result;
                            }, function (error) {
                                $log.error("提示：获取公告失败");
                                $log.error(error);
                            });
                }

            } ]);

});