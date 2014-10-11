'use strict';

define(function (require) {

    require('jquery');
    require('ng');
    require('underscore');

    require('../../../lib/jquery-file-upload/js/vendor/jquery.ui.widget');
    require('../../../lib/jquery-file-upload/js/jquery.iframe-transport');
    require('../../../lib/jquery-file-upload/js/jquery.fileupload');
    require('../../../static/js/configs');
    require('../../../static/js/face-cache');
    require('../../auth/js/auth-models');
    require('../../common/js/common-utils');
    require('../../common/js/file-transfer-services');
    require('./project-services');
    require('./comment-services');
    require('./cully-constants');

    require('../../../lib/jquery-file-upload/css/style.css');
    require('../../../lib/jquery-file-upload/css/jquery.fileupload.css');

    angular.module('project.attachment.controllers', ['configs', 'auth.models', 'face.cache', 'common.utils', 'project.services', 'cully.constants'])
        .controller('ProjectAttachmentListCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'fileApp', 'AttachmentService', 'AttachmentOfProjectService',
                                                    'attachmentFace', 'faceCache',
            function ($scope, $log, $routeParams, currentUser, fileApp, AttachmentService, AttachmentOfProjectService,
                        attachmentFace, faceCache) {

                function renderAttachment(item) {
                    item.url = fileApp + '/' + item.Path.replace(/\\/g, '\/');
                }

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
                                            faceCache.insertFirst(attachmentFace, result);
                                            renderAttachment(result);
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
                                faceCache.init(attachmentFace, result);
                                _.each(result, function (item) {
                                    renderAttachment(item);
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
                            faceCache.remove(attachmentFace, attachment.Id);
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

            } ])
        .controller('ProjectAttachmentDetailsCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'userCache', 'commonUtil', 'fileApp',
                                                        'attachmentFace', 'faceCache', 'CommentListService', 'CommentOfProjectAttachmentService',
            function ($scope, $log, $routeParams, currentUser, userCache, commonUtil, fileApp,
                        attachmentFace, faceCache, CommentListService, CommentOfProjectAttachmentService) {

                function render(comment, i) {
                    comment.index = (parseInt(i) + 1);
                    userCache.get(comment.Creator, function (e) {
                        comment.creatorName = (e == null) ? comment.Creator : e.Name;
                    });
                    if (comment.Creator == currentUser.getUsername()) {
                        comment.editCommentButtonVisible = '';
                    } else {
                        comment.editCommentButtonVisible = 'none';
                    }
                    $scope.commentList.push(comment);
                }

                function loadCommentList() {
                    $scope.commentList.length = 0;
                    $scope.isLoading = true;
                    CommentListService.query({
                        'commentTarget': 'attachment',
                        'targetId': $routeParams.attachmentId
                    })
                    .$promise
                        .then(function (result) {
                            if (angular.isArray(result)) {
                                var len = result.length;
                                for (var i = 0; i < len; i++) {
                                    render(result[i], i);
                                }
                            }
                        }, function (error) {
                            $log.error(error);
                            $scope.alertMessage = "提示：加载评论列表失败";
                        })
                        .then(function () {
                            $scope.isLoading = false;
                        });
                }

                $scope.init = function () {
                    $scope.attachment = faceCache.get(attachmentFace, parseInt($routeParams.attachmentId));
                    commonUtil.buildCreatorName($scope.attachment);

                    $scope.isLoading = false;
                    $scope.navbarLinkVisible = 'none';
                    $scope.comment = {};
                    $scope.commentList = [];

                    loadCommentList();
                }

                $scope.refreshCommentList = function () {
                    loadCommentList();
                }

                $scope.saveComment = function () {
                    if ($scope.comment.id == null || $scope.comment.id == '') {
                        CommentOfProjectAttachmentService.save({
                            'id': $routeParams.attachmentId,
                            'user': currentUser.getUsername(),
                            'content': $scope.comment.content
                        })
                        .$promise
                            .then(function (result) {
                                render(result, $scope.commentList.length);
                                $scope.clearComment();
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessage = "提示：保存评论失败";
                            });
                    } else {
                        CommentService.update({
                            'id': $scope.comment.id,
                            'content': $scope.comment.content
                        })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.commentList) {
                                    if ($scope.commentList[i].Id == result.Id) {
                                        $scope.commentList[i].Content = result.Content;
                                        break;
                                    }
                                }
                                $scope.clearComment();
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessage = "提示：修改评论失败";
                            });
                    }
                }


                $scope.clearComment = function () {
                    $scope.comment.id = '';
                    $scope.comment.content = '';
                }

                $scope.editComment = function (comment) {
                    document.getElementsByName('editCommentPanel')[0].scrollIntoView(true);
                    $scope.comment.id = comment.Id;
                    $scope.comment.content = comment.Content;
                }

                $scope.removeComment = function (comment) {
                    $scope.comment.id = comment.Id;
                    $scope.comment.content = comment.Content;
                }

                $scope.deleteComment = function () {
                    CommentOfProjectAttachmentService.remove({
                        'id': $routeParams.attachmentId,
                        'commentId': $scope.comment.id
                    })
                    .$promise
                        .then(function (result) {
                            $('#removeCommentDialog').modal('hide');
                            for (var i in $scope.commentList) {
                                if ($scope.comment.id == $scope.commentList[i].Id) {
                                    $scope.commentList.splice(i, 1);
                                    break;
                                }
                            }
                            $scope.clearComment();
                        }, function (error) {
                            $('#removeCommentDialog').modal('hide');
                            $log.error(error);
                            $scope.alertMessage = "提示：删除评论失败";
                        });
                }

            } ]);

});