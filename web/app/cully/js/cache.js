'use strict';

define(function (require) {

    angular.module('cache', [])
        .value('userCache', { 'userList': [] })
        .factory('userCacheUtil', ['$log', 'userCache', 'UserListService', function ($log, userCache, UserListService) {

            return {
                init: function () {
                    UserListService.query()
                        .$promise
                            .then(function (result) {
                                userCache.userList = result;
                            }, function (error) {
                                $log.error(error);
                            });
                },
                list: function (successCallback, errorCallback, alwaysCallback) {
                    if (userCache.userList == null) {
                        userCache.userList = [];
                    }
                    if (userCache.userList.length == 0) {
                        UserListService.query()
                            .$promise
                                .then(function (result) {
                                    userCache.userList = result;
                                    if (successCallback != undefined && typeof (successCallback) == 'function') {
                                        successCallback(result);
                                    }
                                    if (alwaysCallback != undefined && typeof (alwaysCallback) == 'function') {
                                        alwaysCallback();
                                    }
                                }, function (error) {
                                    $log.error(error);
                                    if (errorCallback != undefined && typeof (errorCallback) == 'function') {
                                        errorCallback(error);
                                    }
                                    if (alwaysCallback != undefined && typeof (alwaysCallback) == 'function') {
                                        alwaysCallback();
                                    }
                                });
                    } else {
                        if (successCallback != undefined && typeof (successCallback) == 'function') {
                            successCallback(userCache.userList);
                        }
                        if (alwaysCallback != undefined && typeof (alwaysCallback) == 'function') {
                            alwaysCallback();
                        }
                    }
                },
                get: function (key) {
                }
            }

        } ])
        .value('categoryCache', { 'categoryList': [] })
        .factory('categoryCacheUtil', ['$log', 'categoryCache', 'CategoryService', function ($log, categoryCache, CategoryService) {

            return {
                init: function (scope) {
                    CategoryService.query({ 'scope': scope })
                        .$promise
                            .then(function (result) {
                                categoryCache.categoryList.push({ 'key': scope, 'value': result });
                            }, function (error) {
                                $log.error(error);
                            });
                },
                getScopeList: function (scope) {
                    if (categoryCache.categoryList == null) {
                        categoryCache.categoryList = [];
                    }
                    var categoryList = null;
                    if (categoryCache.categoryList.length > 0) {
                        for (var i in categoryCache.categoryList) {
                            if (scope == categoryCache.categoryList[i].key) {
                                categoryList = categoryCache.categoryList[i].value;
                                break;
                            }
                        }
                    }
                    return categoryList;
                },
                list: function (scope, successCallback, errorCallback, alwaysCallback) {
                    var categoryList = this.getScopeList(scope);
                    if (categoryList == null) {
                        CategoryService.query({ 'scope': scope })
                            .$promise
                                .then(function (result) {
                                    categoryCache.categoryList.push({ 'key': scope, 'value': result });
                                    if (successCallback != undefined && typeof (successCallback) == 'function') {
                                        successCallback(result);
                                    }
                                    if (alwaysCallback != undefined && typeof (alwaysCallback) == 'function') {
                                        alwaysCallback();
                                    }
                                }, function (error) {
                                    $log.error(error);
                                    if (errorCallback != undefined && typeof (errorCallback) == 'function') {
                                        errorCallback(error);
                                    }
                                    if (alwaysCallback != undefined && typeof (alwaysCallback) == 'function') {
                                        alwaysCallback();
                                    }
                                });
                    } else {
                        if (successCallback != undefined && typeof (successCallback) == 'function') {
                            successCallback(categoryList);
                        }
                        if (alwaysCallback != undefined && typeof (alwaysCallback) == 'function') {
                            alwaysCallback();
                        }
                    }
                },
                get: function (scope, key, successCallback) {
                    var categoryList = this.getScopeList(scope);
                    if (categoryList == null) {
                        this.list(scope, function (result) {
                            if (result != null && result.length > 0) {
                                for (var i in result) {
                                    if (key == result[i].Code) {
                                        if (successCallback != undefined && typeof (successCallback) == 'function') {
                                            successCallback(result[i]);
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    }
                    else {
                        if (categoryList.length > 0) {
                            for (var i in categoryList) {
                                if (key == categoryList[i].Code) {
                                    return categoryList[i];
                                }
                            }
                        }
                    }
                }
            }

        } ]);

});