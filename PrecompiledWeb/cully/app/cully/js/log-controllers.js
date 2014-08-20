'use strict';

define(function (require) {

    require('ng');
    require('textAngular-sanitize');
    require('textAngular');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./log-services');
    require('../../auth/js/auth-models');
    require('../../auth/js/auth-directives');
    require('../../common/js/common-cache');

    angular.module('log.controllers', ['textAngular', 'filters', 'utils', 'log.services', 'auth.models', 'auth.directives', 'common.cache'])
        .value('logCache', { 'logList': [] })
        .controller('LogSummaryCtrl', ['$scope', '$location', '$log', 'currentUser', 'dateUtil', 'stringUtil',
            'LogListService', 'userCache', 'categoryCache', 'logCache',
            function ($scope, $location, $log, currentUser, dateUtil, stringUtil,
                LogListService, userCache, categoryCache, logCache) {

                var pageSize = 20;

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    $scope.queryModel = {
                        'staff': '',
                        'date': ''
                    }
                    $scope.prevBtnClass = 'disabled';
                    $scope.nextBtnClass = '';
                    $scope.currentPage = -1;

                    userCache.list(function (e) {
                        $scope.users = e;
                    });
                    $scope.query();
                }

                $scope.query = function () {
                    $scope.currentPage = 0;
                    getLogList();
                }

                $scope.prevPage = function () {
                    if ($scope.prevBtnClass == 'disabled') {
                        return;
                    }
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                        getLogList();
                    }
                }

                $scope.nextPage = function () {
                    if ($scope.nextBtnClass == 'disabled') {
                        return;
                    }
                    $scope.currentPage++;
                    getLogList();
                }

                function getLogList() {
                    var startRowIndex = $scope.currentPage * pageSize;
                    var staff = $scope.queryModel.staff;
                    var date = $scope.queryModel.date;
                    var dateInput, spanInput;
                    if (staff == '') {
                        staff = 'null';
                    }
                    if (date == '') {
                        var now = new Date();
                        var s = new Date(now - (1000 * 3600 * 24 * 365));
                        dateInput = dateUtil.formatDateByYMD(s);
                        spanInput = '366';
                    } else {
                        dateInput = dateUtil.getDate(date);
                        spanInput = dateUtil.getSpan(date);
                    }

                    $scope.alertMessageVisible = 'hidden';
                    LogListService.query({ 'user': currentUser.getUsername(),
                        'date': dateInput,
                        'span': spanInput,
                        'creator': staff,
                        'category': 'null',
                        'start': startRowIndex,
                        'count': pageSize
                    })
                        .$promise
                            .then(function (result) {
                                interceptLogList(result);
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：项目列表加载失败";
                            });
                }

                function interceptLogList(result) {
                    if (result != null && result.length > 0) {
                        $scope.logList = [];
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            categoryCache.get('log', item.Category, function (e) {
                                if (e != null) {
                                    item.icon = e.Icon;
                                    item.categoryName = e.Name;
                                }
                            });
                            item.creatorName = getCreatorName(item.Creator);
                            var content = stringUtil.removeHTML(item.Content);
                            item.filterContent = (content != null && content.length > 108) ? content.substring(0, 108) + "..." : content;
                            if (item.Tags != null && item.Tags != '') {
                                item.TagList = item.Tags.split(',');
                            }
                            $scope.logList.push(item);
                        }
                        $scope.nextBtnClass = '';
                    } else {
                        if ($scope.currentPage > 0) {
                            $scope.currentPage--;
                        } else {
                            $scope.logList = [];
                        }
                        $scope.nextBtnClass = 'disabled';
                    }
                    if ($scope.currentPage == 0) {
                        $scope.prevBtnClass = 'disabled';
                    } else {
                        $scope.prevBtnClass = '';
                    }
                    logCache.logList = $scope.logList;
                }

                function getCreatorName(creator) {
                    if ($scope.users != undefined && $scope.users != null) {
                        for (var i in $scope.users) {
                            if ($scope.users[i].Username == creator) {
                                creator = $scope.users[i].Name;
                            }
                        }
                    }
                    return creator;
                }

            } ])
        .controller('LogAddCtrl', ['$scope', '$location', '$log', 'currentUser', 'LogService', 'dateUtil', 'categoryCache', 'CategoryHelper',
            function ($scope, $location, $log, currentUser, LogService, dateUtil, categoryCache, CategoryHelper) {

                $scope.init = function () {
                    $scope.log = { 'startTime': dateUtil.formatDateByYMD(new Date()) };
                    categoryCache.list('log', function (e) {
                        $scope.categoryList = e;
                        CategoryHelper.selectCategory($scope.categoryList, 'dairy', function (ee) {
                            $scope.category = ee;
                        });
                    });
                    $scope.alertMessageVisible = 'hidden';
                }

                $scope.selectCategory = function (selectedCategory) {
                    CategoryHelper.selectCategory($scope.categoryList, selectedCategory.Code, function (e) {
                        $scope.category = e;
                    });
                }

                $scope.save = function () {
                    $scope.alertMessageVisible = 'hidden';
                    if ($scope.log.startTime != undefined && $scope.log.startTime != ''
                                            && $scope.log.content != undefined && $scope.log.content != '') {
                        LogService.save({ 'user': currentUser.getUsername(),
                            'date': $scope.log.startTime,
                            'title': $scope.log.title,
                            'content': $scope.log.content,
                            'category': $scope.category.Code,
                            'tag1': $scope.log.tag1,
                            'tag2': $scope.log.tag2,
                            'tag3': $scope.log.tag3
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/log-summary/');
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：保存记录失败";
                                $log.error(error);
                            });
                    }
                }

            } ])
        .controller('LogEditCtrl', ['$scope', '$routeParams', 'currentUser', 'dateUtil', 'LogService', 'logCache', 'categoryCache', 'CategoryHelper',
            function ($scope, $routeParams, currentUser, dateUtil, LogService, logCache, categoryCache, CategoryHelper) {

                function renderLog(editLog) {
                    CategoryHelper.selectCategory($scope.categoryList, editLog.Category, function (e) {
                        $scope.category = e;
                    });
                    $scope.log = { 'id': editLog.Id, 'title': editLog.Title, 'content': editLog.Content };
                    var d = dateUtil.jsonToDate(editLog.StartTime);
                    if (d != null) {
                        $scope.log.startTime = dateUtil.formatDateByYMD(d);
                    }
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
                    $scope.isLoading = false;
                    $scope.alertMessageVisible = 'hidden';
                    categoryCache.list('log', function (e) {
                        $scope.categoryList = e;

                        var editLog = null;
                        if (logCache.logList != null) {
                            for (var i in logCache.logList) {
                                if ($routeParams.id == logCache.logList[i].Id) {
                                    editLog = logCache.logList[i];
                                    break;
                                }
                            }
                        }
                        if (editLog != null) {
                            renderLog(editLog);
                        }
                    });
                }

                $scope.selectCategory = function (selectedCategory) {
                    CategoryHelper.selectCategory($scope.categoryList, selectedCategory.Code, function (e) {
                        $scope.category = e;
                    });
                }

                $scope.save = function () {
                    if ($scope.log.startTime != undefined && $scope.log.startTime != ''
                        && $scope.log.content != undefined && $scope.log.content != '') {
                        $scope.isLoading = true;
                        $scope.alertMessageVisible = 'hidden';
                        LogService.update({ 'user': currentUser.getUsername(),
                            'id': $scope.log.id,
                            'date': $scope.log.startTime,
                            'title': $scope.log.title,
                            'content': $scope.log.content,
                            'category': $scope.category.Code,
                            'tag1': $scope.log.tag1,
                            'tag2': $scope.log.tag2,
                            'tag3': $scope.log.tag3
                        })
                            .$promise
                                .then(function (result) {
                                    if (logCache.logList != null) {
                                        for (var i in logCache.logList) {
                                            if ($routeParams.id == logCache.logList[i].Id) {
                                                logCache.logList[i] = result;
                                                break;
                                            }
                                        }
                                    }
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
                    'CommentListService', 'Update4CommentLogService', 'userCache', 'logCache',
            function ($scope, $location, $routeParams, $log, currentUser, LogService, CommentService,
                    CommentListService, Update4CommentLogService, userCache, logCache) {

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
                    if (logCache.logList != null) {
                        for (var i in logCache.logList) {
                            if ($routeParams.id == logCache.logList[i].Id) {
                                $scope.log = logCache.logList[i];
                                break;
                            }
                        }
                    }
                    CommentListService.query({ 'user': currentUser.getUsername(),
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
                            CommentService.update({ 'user': currentUser.getUsername(),
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
                            Update4CommentLogService.save({ 'user': currentUser.getUsername(),
                                'id': $scope.log.Id,
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
                    Update4CommentLogService.remove({ 'user': currentUser.getUsername(),
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

            } ]);

});