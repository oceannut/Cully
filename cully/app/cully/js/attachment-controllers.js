'use strict';

define(function (require) {

    require('jquery');
    require('ng');
    require('underscore');

    require('../../../lib/jquery-file-upload/js/vendor/jquery.ui.widget');
    require('../../../lib/jquery-file-upload/js/jquery.iframe-transport');
    require('../../../lib/jquery-file-upload/js/jquery.fileupload');
    require('../../auth/js/auth-models');
    require('../../common/js/file-transfer-services');
    require('./project-services');

    require('../../../lib/jquery-file-upload/css/style.css');
    require('../../../lib/jquery-file-upload/css/jquery.fileupload.css');

    angular.module('attachment.controllers', ['project.services', 'auth.models'])
        .controller('AttachmentListCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'AttachmentService',
            function ($scope, $log, $routeParams, currentUser, AttachmentService) {

                $scope.init = function () {

                    $scope.faceModel = {
                        projectId: $routeParams.projectId
                    };

                    $scope.events = {
                        alertMessage: '',
                        isBusy: false,
                        uploadFiles: []
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
                                    AttachmentService.save({
                                        'projectId': $scope.faceModel.projectId,
                                        'user': currentUser.getUsername(),
                                        'uploadFile': $scope.events.uploadFiles[0]
                                    })
                                    .$promise
                                        .then(function (result) {
                                            console.log(result);
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

                }

            } ]);

});