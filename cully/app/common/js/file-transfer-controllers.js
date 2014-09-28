'use strict';

define(function (require) {

    require('jquery');
    require('ng');
    require('underscore');

    require('../../../lib/jquery-file-upload/js/vendor/jquery.ui.widget');
    require('../../../lib/jquery-file-upload/js/jquery.iframe-transport');
    require('../../../lib/jquery-file-upload/js/jquery.fileupload');
    require('../../../static/js/configs');
    require('../../../static/js/utils');
    require('../../common/js/common-cache');
    require('./file-transfer-services');

    require('../../../lib/jquery-file-upload/css/style.css');
    require('../../../lib/jquery-file-upload/css/jquery.fileupload.css');

    angular.module('fileTransfer.controllers', ['configs', 'utils', 'common.cache', 'fileTransfer.services'])
        .controller('FileTransferOverviewCtrl', ['$scope', '$log', '$location', '$http', 'currentUser', 'fileApp', 'dateUtil', 'userCache',
                                                    'UploadLogListService', 'UploadService', 'UploadLogService',
            function ($scope, $log, $location, $http, currentUser, fileApp, dateUtil, userCache,
                        UploadLogListService, UploadService, UploadLogService) {

                var pageSize = 20;

                function renderSize(item, size) {
                    item.fileSizeUnit = "KB"
                    item.fileSize = Math.ceil(size / 1024);
                    if (item.fileSize > 1024) {
                        item.fileSizeUnit = "MB"
                        item.fileSize = Math.round(item.fileSize / 1024 * 100) / 100;
                    }
                }

                function renderLog(item) {
                    renderSize(item, item.Size);
                    userCache.get(item.User, function (e) {
                        item.userName = (e == null) ? item.User : e.Name;
                    });
                    item.url = fileApp + '/' + item.Path.replace(/\\/g, '\/');
                }

                function load() {
                    $scope.events.logList.length = 0;
                    var startRowIndex = $scope.faceModel.currentPage * pageSize;
                    var staff = $scope.faceModel.staff;
                    var date = $scope.faceModel.date;

                    if (staff === '') {
                        staff = 'null';
                    }
                    var startDay, span;
                    if (date != '') {
                        if (date == '-30') {
                            $scope.faceModel.monthInputVisible = '';
                            if ($scope.faceModel.month != '') {
                                var array = $scope.faceModel.month.split('-');
                                var d = new Date(array[0], parseInt(array[1]) - 1, 1);
                                startDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                                span = dateUtil.getDaysofMonth(d.getMonth() + 1);
                            }
                        } else {
                            $scope.faceModel.monthInputVisible = 'none';
                            startDay = dateUtil.getDate(date);
                            span = dateUtil.getSpan(date);
                        }

                    } else {
                        $scope.faceModel.monthInputVisible = 'none';
                        startDay = 'null';
                        span = 'null';
                    }
                    if (startDay != undefined && span != undefined) {
                        $scope.events.alertMessage = "";
                        $scope.events.isLoading = true;
                        $scope.events.loadText = "努力加载中，请等待...";
                        UploadLogListService.query({ 'user': staff,
                            'date': startDay,
                            'span': span,
                            'start': startRowIndex,
                            'count': pageSize
                        })
                        .$promise
                            .then(function (result) {
                                if (angular.isArray(result)) {
                                    _.each(result, function (item) {
                                        renderLog(item);
                                        $scope.events.logList.push(item);
                                    });
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.events.alertMessage = "提示：获取文件上传集合失败";
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    }
                }

                $scope.init = function () {

                    $scope.faceModel = {
                        'staff': '',
                        'date': '',
                        'month': '',
                        'monthInputVisible': 'none',
                        'prevBtnClass': 'disabled',
                        'nextBtnClass': '',
                        'currentPage': -1,
                        'users': null
                    }
                    userCache.list(function (e) {
                        $scope.faceModel.users = e;
                    });

                    $scope.events = {
                        alertMessage: '',
                        isLoading: false,
                        loadText: '',
                        alertMessage4upload: '',
                        isBusy: false,
                        fileList: [],
                        logList: []
                    };

                    $('#fileupload').fileupload({
                        url: 'upload',
                        dataType: 'json',
                        start: function (e) {
                            $scope.$apply(function () {
                                $scope.events.isBusy = true;
                            });
                        },
                        stop: function (e) {
                            $scope.$apply(function () {
                                $scope.events.isBusy = false;
                            });
                        },
                        done: function (e, data) {
                            if (angular.isArray(data.result)) {
                                $scope.$apply(function () {
                                    _.each(data.result, function (item) {
                                        renderSize(item, item.Size);
                                        $scope.events.fileList.push(item);
                                    });
                                });
                            }
                        },
                        fail: function (e, data) {
                            console.log(data.errorThrown);
                        },
                        progressall: function (e, data) {
                            var progress = parseInt(data.loaded / data.total * 100, 10);
                            $('#progress .progress-bar').css(
                                                    'width',
                                                    progress + '%'
                                                );
                        }
                    }).prop('disabled', !$.support.fileInput)
                                        .parent().addClass($.support.fileInput ? undefined : 'disabled');

                    $scope.query();
                }

                $scope.query = function () {
                    $scope.faceModel.currentPage = 0;
                    load();
                }

                $scope.prevPage = function () {
                    if ($scope.faceModel.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.faceModel.currentPage > 0) {
                        $scope.faceModel.currentPage--;
                        load();
                    }
                }

                $scope.nextPage = function () {
                    if ($scope.faceModel.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.faceModel.currentPage++;
                    load();
                }

                $scope.saveUpload = function () {
                    $scope.events.alertMessage4upload = "";
                    $scope.events.isBusy = true;
                    UploadLogService.save({
                        "user": currentUser.getUsername(),
                        "uploadFiles": $scope.events.fileList
                    })
                    .$promise
                        .then(function (result) {
                            $scope.events.fileList.length = 0;
                            $('#uploadDialog').modal('hide');
                            if (angular.isArray(result)) {
                                for (var i = 0; i < result.length; i++) {
                                    renderLog(result[i]);
                                    $scope.events.logList.splice(0, 0, result[i]);
                                }
                            }
                        }, function (error) {
                            $log.error(error);
                            $scope.events.alertMessage4upload = "提示：提交上传失败";
                        })
                        .then(function () {
                            $scope.events.isBusy = false;
                        });
                }

                $scope.removeFile = function (file) {
                    $scope.events.alertMessage4upload = "";
                    UploadService.remove({
                        "uploadFile": file
                    })
                    .$promise
                        .then(function (result) {
                            for (var i in $scope.events.fileList) {
                                if (file.Path === $scope.events.fileList[i].Path) {
                                    $scope.events.fileList.splice(i, 1);
                                    break;
                                }
                            }
                        }, function (error) {
                            $log.error(error);
                            $scope.events.alertMessage4upload = "提示：删除文件失败";
                        });
                }

                $scope.removeLog = function (log) {
                    $scope.events.alertMessage = "";
                    $scope.events.isLoading = true;
                    $scope.events.loadText = "正在删除文件，请等待...";
                    UploadLogService.update({
                        'id': log.Id
                    })
                    .$promise
                        .then(function (result) {
                            log.IsRemoved = true;
                        }, function (error) {
                            $log.error(error);
                            $scope.events.alertMessage = "提示：删除文件失败";
                        })
                        .then(function () {
                            $scope.events.isLoading = false;
                        });
                }

                $scope.copyUrl = function (url) {
                    console.log(url);

                }

            } ]);


});