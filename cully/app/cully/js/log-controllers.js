'use strict';

define(function (require) {

    require('angular');
    require('textAngular-sanitize');
    require('textAngular');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./log-services');
    require('./cache');

    angular.module('log.controllers', ['textAngular', 'configs', 'filters', 'utils', 'log.services', 'cache'])
        .value('logCache', { 'logList': [] })
        .controller('LogSummaryCtrl', ['$scope', '$location', 'currentUser', 'dateUtil', 'stringUtil',
            'LogListService', 'userCache', 'logCache', 'categoryCacheUtil',
            function ($scope, $location, currentUser, dateUtil, stringUtil,
                LogListService, userCache, logCache, categoryCacheUtil) {

                var pageSize = 20;

                $scope.init = function () {
                    $scope.queryModel = {
                        'staff': '',
                        'date': ''
                    }
                    $scope.prevBtnClass = 'disabled';
                    $scope.nextBtnClass = '';
                    $scope.currentPage = -1;

                    $scope.users = userCache.userList;
                    $scope.query();
                }

                $scope.createLog = function () {
                    $location.path('/log-add/');
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

                    LogListService.query({ 'user': currentUser.username,
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
                                console.log("error: " + error);
                            });
                }

                function interceptLogList(result) {
                    if (result != null && result.length > 0) {
                        $scope.logList = [];
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            var category = categoryCacheUtil.get('log', item.Category);
                            if (category != null) {
                                item.icon = category.Icon;
                                item.categoryName = category.Name;
                            }
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
        .controller('LogAddCtrl', ['$scope', '$location', 'currentUser', 'LogService', 'dateUtil', 'categoryCacheUtil',
            function ($scope, $location, currentUser, LogService, dateUtil, categoryCacheUtil) {

                function _selectCategory(code) {
                    for (var i = 0; i < $scope.categoryList.length; i++) {
                        var category = $scope.categoryList[i];
                        if (category.Code == code) {
                            category.active = "active";
                            $scope.category = category;
                        } else {
                            category.active = "";
                        }
                    }
                }

                $scope.init = function () {
                    $scope.log = {};
                    $scope.log.startTime = dateUtil.formatDateByYMD(new Date());
                    categoryCacheUtil.list('log', function (result) {
                        $scope.categoryList = result;
                        _selectCategory('diary');
                    });
                }

                $scope.selectCategory = function (selectedCategory) {
                    _selectCategory(selectedCategory.Code);
                }

                $scope.save = function () {
                    if ($scope.log.startTime != undefined && $scope.log.startTime != ''
                                            && $scope.log.content != undefined && $scope.log.content != '') {
                        LogService.save({ 'user': currentUser.username,
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
        .controller('LogEditCtrl', ['$scope', '$location', '$routeParams', 'currentUser', 'dateUtil', 'LogService', 'logCache', 'categoryCacheUtil',
            function ($scope, $location, $routeParams, currentUser, dateUtil, LogService, logCache, categoryCacheUtil) {

                $scope.isLoading = false;
                $scope.alertMessageVisible = 'hidden';

                function _selectCategory(code) {
                    for (var i = 0; i < $scope.categoryList.length; i++) {
                        var category = $scope.categoryList[i];
                        if (category.Code == code) {
                            category.active = "active";
                            $scope.category = category;
                        } else {
                            category.active = "";
                        }
                    }
                }

                function renderLog(editLog) {
                    _selectCategory(editLog.Category);
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
                    categoryCacheUtil.list('log', function (result) {
                        $scope.categoryList = result;

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
                    _selectCategory(selectedCategory.Code);
                }

                $scope.save = function () {
                    if ($scope.log.startTime != undefined && $scope.log.startTime != ''
                        && $scope.log.content != undefined && $scope.log.content != '') {
                        $scope.isLoading = true;
                        LogService.update({ 'user': currentUser.username,
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
                                    $scope.isLoading = false;
                                    renderLog(result);
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessageColor = 'alert-success';
                                    $scope.alertMessage = "提示：修改记录成功";
                                }, function (error) {
                                    $scope.isLoading = false;
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessageColor = 'alert-danger';
                                    $scope.alertMessage = "提示：修改记录失败";
                                    $log.error(error);
                                });
                    }
                }

            } ])
        .controller('LogDetailsCtrl', ['$scope', '$location', '$routeParams', '$log', 'currentUser', 'LogService', 'CommentService',
                    'CommentListService', 'Update4CommentLogService', 'logCache', 'userCacheUtil',
            function ($scope, $location, $routeParams, $log, currentUser, LogService, CommentService,
                    CommentListService, Update4CommentLogService, logCache, userCacheUtil) {

                $scope.alertMessageVisible = 'hidden';

                function render(comment, i) {
                    comment.index = (parseInt(i) + 1);
                    var user = userCacheUtil.get(comment.Creator);
                    comment.creatorName = (user == null) ? comment.Creator : user.Name;
                    if (comment.Creator == currentUser.username) {
                        comment.editCommentButtonVisible = '';
                    } else {
                        comment.editCommentButtonVisible = 'none';
                    }
                }

                $scope.init = function () {
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
                    CommentListService.query({ 'user': currentUser.username,
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
                            CommentService.update({ 'user': currentUser.username,
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
                            Update4CommentLogService.save({ 'user': currentUser.username,
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
                    Update4CommentLogService.remove({ 'user': currentUser.username,
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