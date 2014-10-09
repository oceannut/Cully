'use strict';

define(function (require) {

    require('ng');
    require('textAngular-sanitize');
    require('textAngular');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('../../../static/js/face-cache');
    require('../../auth/js/auth-models');
    require('../../auth/js/auth-directives');
    require('../../common/js/common-cache');
    require('../../common/js/common-utils');
    require('./client-services');
    require('./log-services');
    require('./cully-constants');

    angular.module('log.controllers', ['textAngular', 'filters', 'utils', 'face.cache', 'auth.models', 'auth.directives', 'common.cache',
                                        'common.utils', 'client.services', 'log.services', 'cully.constants'])
        .controller('LogSummaryCtrl', ['$scope', '$routeParams', '$location', '$log', 'currentUser', 'dateUtil', 'stringUtil',
            'userCache', 'categoryCache', 'localStorageUtil', 'logFace', 'faceCache', 'LogListService',
            function ($scope, $routeParams, $location, $log, currentUser, dateUtil, stringUtil,
                userCache, categoryCache, localStorageUtil, logFace, faceCache, LogListService) {

                var pageSize = localStorageUtil.getUserData(currentUser.getUsername(), localStorageUtil.pageSize, localStorageUtil.pageSizeDV, true);

                $scope.init = function () {
                    var reload = $routeParams.reload;
                    $scope.events = {
                        alertMessage: '',
                        isLoading: false,
                        logList: []
                    };
                    if (reload === 'true') {
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

                        $scope.query();
                    } else {
                        $scope.faceModel = faceCache.getModel(logFace);
                        faceCache.pull(logFace, $scope.events.logList);
                    }
                }

                $scope.query = function () {
                    $scope.faceModel.currentPage = 0;
                    loadLogList();
                }

                $scope.prevPage = function () {
                    if ($scope.faceModel.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.faceModel.currentPage > 0) {
                        $scope.faceModel.currentPage--;
                        loadLogList();
                    }
                }

                $scope.nextPage = function () {
                    if ($scope.faceModel.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.faceModel.currentPage++;
                    loadLogList();
                }

                function loadLogList() {
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
                        $scope.events.alertMessage = '';
                        $scope.events.isLoading = true;
                        LogListService.query({
                            'date': startDay,
                            'span': span,
                            'creator': staff,
                            'category': 'null',
                            'start': startRowIndex,
                            'count': pageSize
                        })
                        .$promise
                            .then(function (result) {
                                interceptLogList(result);
                                faceCache.init(logFace, $scope.events.logList);
                            }, function (error) {
                                $log.error(error);
                                $scope.events.alertMessage = "提示：项目列表加载失败";
                            })
                            .then(function () {
                                $scope.events.isLoading = false;
                            });
                    }
                }

                function interceptLogList(result) {
                    $scope.events.logList.length = 0;
                    if (result != null && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            categoryCache.get('log', item.Category, function (e) {
                                if (e != null) {
                                    item.icon = e.Icon;
                                    item.categoryName = e.Name;
                                }
                            });
                            if (item.Creator === currentUser.getUsername()) {
                                item.isEditable = true;
                            } else {
                                item.isEditable = false;
                            }
                            item.creatorName = getCreatorName(item.Creator);
                            var content = stringUtil.removeHTML(item.Content);
                            item.filterContent = (content != null && content.length > 108) ? content.substring(0, 108) + "..." : content;
                            if (item.Tags != null && item.Tags != '') {
                                item.TagList = item.Tags.split(',');
                            }
                            $scope.events.logList.push(item);
                        }
                        $scope.faceModel.nextBtnClass = '';
                    } else {
                        if ($scope.faceModel.currentPage > 0) {
                            $scope.faceModel.currentPage--;
                        } else {
                            $scope.events.logList.length = 0;
                        }
                        $scope.faceModel.nextBtnClass = 'disabled';
                    }
                    if ($scope.faceModel.currentPage == 0) {
                        $scope.faceModel.prevBtnClass = 'disabled';
                    } else {
                        $scope.faceModel.prevBtnClass = '';
                    }
                }

                function getCreatorName(creator) {
                    if ($scope.faceModel.users != undefined && $scope.faceModel.users != null) {
                        for (var i in $scope.faceModel.users) {
                            if ($scope.faceModel.users[i].Username == creator) {
                                creator = $scope.faceModel.users[i].Name;
                            }
                        }
                    }
                    return creator;
                }

            } ])
        .controller('LogAddCtrl', ['$scope', '$routeParams', '$location', '$log', 'currentUser', 'LogService', 'commonUtil', 'logFace', 'faceCache',
            function ($scope, $routeParams, $location, $log, currentUser, LogService, commonUtil, logFace, faceCache) {

                $scope.init = function () {
                    $scope.categoryList = [];
                    $scope.log = { projectId: $routeParams.projectId };
                    commonUtil.bindCategoryList($scope.categoryList, 'log', 'dairy', function (e) {
                        $scope.category = e;
                    });
                    $scope.isLoading = false;
                    $scope.alertMessage = "";
                }

                $scope.selectCategory = function (selectedCategory) {
                    commonUtil.selectCategory($scope.categoryList, selectedCategory.Code, function (e) {
                        $scope.category = e;
                    });
                }

                $scope.save = function () {
                    $scope.alertMessage = "";
                    if ($scope.log.content === undefined
                        || $scope.log.content === null
                        || $scope.log.content.trim() === '') {
                        $scope.alertMessageColor = "alert-warning";
                        $scope.alertMessage = "提示：请填写内容";
                        return;
                    }
                    $scope.isLoading = true;
                    LogService.save({
                        'user': currentUser.getUsername(),
                        'projectId': $scope.log.projectId,
                        'title': $scope.log.title,
                        'content': $scope.log.content,
                        'category': $scope.category.Code,
                        'tag1': $scope.log.tag1,
                        'tag2': $scope.log.tag2,
                        'tag3': $scope.log.tag3
                    })
                    .$promise
                        .then(function (result) {
                            if ($scope.log.projectId > 0) {
                                $location.path('/project-log-list/' + $scope.log.projectId + '/false/');
                            } else {
                                $location.path('/log-summary/false/');
                            }
                        }, function (error) {
                            $scope.alertMessageColor = "alert-danger";
                            $scope.alertMessage = "提示：保存记录失败";
                            $log.error(error);
                        })
                        .then(function () {
                            $scope.isLoading = false;
                        });
                }

                $scope.cancel = function () {
                    if ($scope.log.projectId > 0) {
                        $location.path('/project-log-list/' + $scope.log.projectId + '/false/');
                    } else {
                        $location.path('/log-summary/false/');
                    }
                }

            } ])
        .controller('LogEditCtrl', ['$scope', '$routeParams', 'currentUser', 'dateUtil', 'LogService', 'commonUtil', 'logFace', 'faceCache',
            function ($scope, $routeParams, currentUser, dateUtil, LogService, commonUtil, logFace, faceCache) {

                function renderLog(editLog) {
                    commonUtil.selectCategory($scope.categoryList, editLog.Category, function (e) {
                        $scope.category = e;
                    });
                    $scope.log = {
                        'id': editLog.Id,
                        'title': editLog.Title,
                        'content': editLog.Content
                    };
                    var tags = editLog.Tags;
                    if (tags != undefined && tags != null) {
                        var tagArray = tags.split(',');
                        if (tagArray.length > 0) {
                            $scope.log.tag1 = tagArray[0];
                        }
                        if (tagArray.length > 1) {
                            $scope.log.tag2 = tagArray[1];
                        }
                        if (tagArray.length > 2) {
                            $scope.log.tag3 = tagArray[2];
                        }
                    }
                }

                $scope.init = function () {
                    $scope.categoryList = [];
                    $scope.isLoading = false;
                    $scope.alertMessageVisible = 'hidden';
                    commonUtil.bindCategoryList($scope.categoryList, 'log');

                    var editLog = faceCache.get(logFace, parseInt($routeParams.id));

                    commonUtil.selectCategory($scope.categoryList, editLog.Category, function (e) {
                        $scope.category = e;
                    });
                    if (editLog != null) {
                        renderLog(editLog);
                    }

                }

                $scope.selectCategory = function (selectedCategory) {
                    commonUtil.selectCategory($scope.categoryList, selectedCategory.Code, function (e) {
                        $scope.category = e;
                    });
                }

                $scope.save = function () {
                    if ($scope.log.content != undefined && $scope.log.content != '') {
                        $scope.isLoading = true;
                        $scope.alertMessageVisible = 'hidden';
                        LogService.update({
                            'id': $scope.log.id,
                            'title': $scope.log.title,
                            'content': $scope.log.content,
                            'category': $scope.category.Code,
                            'tag1': $scope.log.tag1,
                            'tag2': $scope.log.tag2,
                            'tag3': $scope.log.tag3
                        })
                        .$promise
                            .then(function (result) {
                                faceCache.replace(logFace, result);
                                renderLog(result);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-success';
                                $scope.alertMessage = "提示：修改记录成功";
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessageColor = 'alert-danger';
                                $scope.alertMessage = "提示：修改记录失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $scope.isLoading = false;
                            });
                    }
                }

            } ])
        .controller('LogDetailsCtrl', ['$scope', '$location', '$routeParams', '$log', 'currentUser', 'LogService', 'CommentService',
                    'CommentListService', 'CommentOfLogService', 'userCache', 'logFace', 'faceCache',
            function ($scope, $location, $routeParams, $log, currentUser, LogService, CommentService,
                    CommentListService, CommentOfLogService, userCache, logFace, faceCache) {

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
                }

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    $scope.commentList = [];
                    $scope.comment = {};

                    $scope.log = faceCache.get(logFace, parseInt($routeParams.id));
                    if ($scope.log === undefined || $scope.log === null) {
                        $scope.alertMessageVisible = 'show';
                        $scope.alertMessage = "提示：工作记录已被移除";
                        return;
                    }
                    CommentListService.query({
                        'commentTarget': 'log',
                        'targetId': $scope.log.Id
                    })
                    .$promise
                        .then(function (result) {
                            $scope.commentList = result;
                            for (var i in $scope.commentList) {
                                var comment = $scope.commentList[i];
                                render(comment, i);
                            }
                        }, function (error) {
                            $log.error(error);
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：加载评论列表失败";
                        });
                }

                $scope.saveComment = function () {
                    if ($scope.comment.content != undefined && $scope.comment.content != '') {
                        if ($scope.comment.id != undefined && $scope.comment.id != null) {
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
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：修改评论失败";
                                });
                        } else {
                            CommentOfLogService.save({
                                'id': $scope.log.Id,
                                'user': currentUser.getUsername(),
                                'content': $scope.comment.content
                            })
                            .$promise
                                .then(function (result) {
                                    $scope.commentList.push(result);
                                    render(result, $scope.commentList.length - 1);
                                    $scope.clearComment();
                                }, function (error) {
                                    $log.error(error);
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：保存评论失败";
                                });
                        }
                    }
                }

                $scope.editComment = function (comment) {
                    $scope.comment.id = comment.Id;
                    $scope.comment.content = comment.Content;
                    document.getElementsByName('editCommentPanel')[0].scrollIntoView(true);
                }

                $scope.clearComment = function () {
                    $scope.comment.id = '';
                    $scope.comment.content = '';
                }

                $scope.removeComment = function (comment) {
                    $scope.comment.id = comment.Id;
                    $scope.comment.content = comment.Content;
                }

                $scope.deleteComment = function () {
                    CommentOfLogService.remove({
                        'id': $scope.log.Id,
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
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：删除评论失败";
                        });
                }

                $scope.viewList = function () {
                    if ($scope.log === undefined) {
                        history.back();
                    }
                    else if ($scope.log.ProjectId > 0) {
                        $location.path('/project-log-list/' + $scope.log.ProjectId + '/false/');
                    } else {
                        $location.path('/log-summary/false/');
                    }
                }

            } ]);

});