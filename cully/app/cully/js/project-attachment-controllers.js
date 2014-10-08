'use strict';

define(function (require) {

    require('jquery');
    require('ng');
    require('underscore');

    require('../../../lib/jquery-file-upload/js/vendor/jquery.ui.widget');
    require('../../../lib/jquery-file-upload/js/jquery.iframe-transport');
    require('../../../lib/jquery-file-upload/js/jquery.fileupload');
    require('../../../static/js/configs');
    require('../../auth/js/auth-models');
    require('../../common/js/file-transfer-services');
    require('./project-services');

    require('../../../lib/jquery-file-upload/css/style.css');
    require('../../../lib/jquery-file-upload/css/jquery.fileupload.css');

    angular.module('project.attachment.controllers', ['configs', 'project.services', 'auth.models'])
        .controller('ProjectAttachmentListCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'fileApp', 'AttachmentService', 'AttachmentOfProjectService',
            function ($scope, $log, $routeParams, currentUser, fileApp, AttachmentService, AttachmentOfProjectService) {

                $scope.init = function () {

                    $scope.faceModel = {
                        projectId: $routeParams.projectId
                    };

                    $scope.events = {
                        alertMessage: '',
                        isBusy: false,
                        uploadFiles: [],
                        attachmentList: []
                    };

                    $('#fileupload').fileupload({
                        url: 'upload',
                        dataType: 'json',
                        start: function (e) {
                            $scope.events.uploadFiles.length = 0;
                            $scope.$apply(function () {
                                $scope.events.alertMessage = '';
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
                                _.each(data.result, function (item) {
                                    $scope.events.uploadFiles.push(item);
                                });
                                if ($scope.events.uploadFiles.length > 0) {
                                    $scope.alertMessage = "";
                                    AttachmentService.save({
                                        'projectId': $scope.faceModel.projectId,
                                        'user': currentUser.getUsername(),
                                        'uploadFile': $scope.events.uploadFiles[0]
                                    })
                                    .$promise
                                        .then(function (result) {
                                            result.url = fileApp + '/' + result.Path.replace(/\\/g, '\/');
                                            $scope.events.attachmentList.push(result);
                                        }, function (error) {
                                            $log.error(error);
                                            $scope.alertMessage = "提示：文件上传失败";
                                        });
                                }
                            }
                        },
                        fail: function (e, data) {
                            $log.error(data);
                            $scope.$apply(function () {
                                $scope.events.alertMessage = '文件上传错误：' + data.errorThrown;
                            });
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
                    $scope.events.attachmentList.length = 0;
                    $scope.alertMessage = "";
                    AttachmentOfProjectService.query({
                        'projectId': $scope.faceModel.projectId
                    })
                    .$promise
                        .then(function (result) {
                            if (angular.isArray(result)) {
                                _.each(result, function (item) {
                                    item.url = fileApp + '/' + item.Path.replace(/\\/g, '\/');
                                    $scope.events.attachmentList.push(item);
                                });
                            }
                        }, function (error) {
                            $log.error(error);
                            $scope.alertMessage = "提示：加载文件失败";
                        });
                }

                $scope.remove = function (attachment) {
                    $scope.alertMessage = "";
                    AttachmentService.remove({
                        'projectId': $scope.faceModel.projectId,
                        'attachmentId': attachment.Id
                    })
                    .$promise
                        .then(function (result) {
                            for (var i in $scope.events.attachmentList) {
                                if (attachment.Id === $scope.events.attachmentList[i].Id) {
                                    $scope.events.attachmentList.splice(i, 1);
                                    break;
                                }
                            }
                        }, function (error) {
                            $log.error(error);
                            $scope.alertMessage = "提示：删除文件失败";
                        });
                }

            } ]);

});