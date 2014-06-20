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
            'LogListService4User', 'LogListService4UserByDate', 'LogListService', 'LogListServiceByDate',
            'userCache', 'logCache',
            function ($scope, $location, currentUser, dateUtil, stringUtil,
                LogListService4User, LogListService4UserByDate, LogListService, LogListServiceByDate,
                userCache, logCache) {

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

                $scope.remark = function (id) {
                    $location.path('/log-details/' + id + '/');
                }

                $scope.edit = function (id) {
                    $location.path('/log-edit/' + id + '/');
                }

                function getLogList() {
                    var startRowIndex = $scope.currentPage * pageSize;
                    var staff = $scope.queryModel.staff;
                    var date = $scope.queryModel.date;
                    if (staff != '' && date != '') {
                        LogListService4UserByDate.query({ 'user': staff,
                            'date': dateUtil.getDate(date),
                            'span': dateUtil.getSpan(date),
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    interceptLogList(result);
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    } else if (staff == '' && date != '') {
                        LogListServiceByDate.query({ 'date': dateUtil.getDate(date),
                            'span': dateUtil.getSpan(date),
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    interceptLogList(result);
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    } else if (staff != '' && date == '') {
                        LogListService4User.query({ 'user': staff,
                            'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    interceptLogList(result);
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    } else {
                        LogListService.query({ 'start': startRowIndex,
                            'count': pageSize
                        })
                            .$promise
                                .then(function (result) {
                                    interceptLogList(result);
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    }
                }

                function interceptLogList(result) {
                    if (result != null && result.length > 0) {
                        $scope.logList = [];
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            item.CreatorName = getCreatorName(item.Creator);
                            var content = stringUtil.removeHTML(item.Content);
                            item.filterContent = (content != null && content.length > 108) ? content.substring(0, 108) + "..." : content;
                            if (item.Tags != null && item.Tags != '') {
                                item.TagList = item.Tags.split(',');
                            }
                            if (item.Creator == currentUser.username) {
                                item.EditBtnVisible = '';
                            } else {
                                item.EditBtnVisible = 'none';
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
        .controller('LogAddCtrl', ['$scope', '$location', 'currentUser', 'LogService',
            function ($scope, $location, currentUser, LogService) {

                $scope.init = function () {
                    $scope.log = {};
                    //$scope.disabled = false;
                }

                $scope.save = function () {
                    if ($scope.log.startTime != undefined && $scope.log.startTime != ''
                                            && $scope.log.content != undefined && $scope.log.content != '') {
                        LogService.save({ 'user': currentUser.username,
                            'date': $scope.log.startTime,
                            'content': $scope.log.content,
                            'tag1': $scope.log.tag1,
                            'tag2': $scope.log.tag2,
                            'tag3': $scope.log.tag3
                        })
                        .$promise
                            .then(function (result) {
                                $location.path('/log-summary/');
                            }, function (error) {
                                console.log("error: " + error);
                            });
                    }
                }

                $scope.cancel = function () {
                    history.back();
                }

            } ])
        .controller('LogEditCtrl', ['$scope', '$location', '$routeParams', 'currentUser', 'dateUtil', 'LogUpdateService', 'logCache',
            function ($scope, $location, $routeParams, currentUser, dateUtil, LogUpdateService, logCache) {

                $scope.init = function () {
                    var result = null;
                    if (logCache.logList != null) {
                        for (var i in logCache.logList) {
                            if ($routeParams.id == logCache.logList[i].Id) {
                                result = logCache.logList[i];
                                break;
                            }
                        }
                    }
                    if (result != null) {
                        $scope.log = { 'content': result.Content };
                        var d = dateUtil.jsonToDate(result.StartTime);
                        if (d != null) {
                            $scope.log.startTime = dateUtil.formatDateByYMD(d);
                        }
                        var tags = result.Tags;
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
                }

                $scope.save = function () {
                    if ($scope.log.startTime != undefined && $scope.log.startTime != ''
                        && $scope.log.content != undefined && $scope.log.content != '') {
                        LogUpdateService.update({ 'user': currentUser.username,
                            'id': $routeParams.id,
                            'date': $scope.log.startTime,
                            'content': $scope.log.content,
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
                                    $location.path('/log-details/' + $routeParams.id + '/');
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                    }
                }

                $scope.cancel = function () {
                    history.back();
                }

            } ])
        .controller('LogDetailsCtrl', ['$scope', '$location', '$routeParams', 'currentUser', 'LogService', 'CommentService', 'CommentUpdateService', 'logCache',
            function ($scope, $location, $routeParams, currentUser, LogService, CommentService, CommentUpdateService, logCache) {

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
                    CommentService.query({ 'user': currentUser.username,
                        'logId': $scope.log.Id
                    })
                        .$promise
                            .then(function (result) {
                                $scope.commentList = result;
                            }, function (error) {
                                console.log("error: " + error);
                            });
                }

                $scope.saveComment = function () {
                    if ($scope.comment.content != undefined && $scope.comment.content != '') {
                        if ($scope.comment.id != undefined && $scope.comment.id != null) {
                            CommentUpdateService.update({ 'user': currentUser.username,
                                'id': $scope.comment.id,
                                'content': $scope.comment.content
                            })
                            .$promise
                                .then(function (result) {
                                    for (var i in $scope.commentList) {
                                        if ($scope.commentList[i].Id == result.Id) {
                                            $scope.commentList[i] = result;
                                        }
                                    }
                                    $scope.clearComment();
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                        } else {
                            CommentService.save({ 'user': currentUser.username,
                                'logId': $scope.log.Id,
                                'content': $scope.comment.content
                            })
                            .$promise
                                .then(function (result) {
                                    $scope.commentList.push(result);
                                    $scope.clearComment();
                                }, function (error) {
                                    console.log("error: " + error);
                                });
                        }
                    }
                }

                $scope.editComment = function (comment) {
                    $scope.comment.id = comment.Id;
                    $scope.comment.content = comment.Content;
                    console.log($scope.comment);
                    document.getElementsByName('editCommentPanel')[0].scrollIntoView(true);
                }

                $scope.clearComment = function () {
                    $scope.comment.content = '';
                }

                $scope.goback = function () {
                    $location.path('/log-summary/');
                }

            } ]);

});