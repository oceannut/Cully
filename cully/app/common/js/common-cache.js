'use strict';

define(function (require) {

    require('ng');

    require('./user-services');
    require('./category-services');

    angular.module('common.cache', ['user.services', 'category.services'])
        .factory('userCache', ['$log', 'UserListService',
            function ($log, UserListService) {

                var isSync = false;
                var list = [];

                function fetch(callback) {
                    list.length = 0;
                    UserListService.query()
                        .$promise
                            .then(function (result) {
                                if (result != null && result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        list.push(result[i]);
                                    }
                                }
                                isSync = true;
                            }, function (error) {
                                isSync = false;
                                $log.error("同步缓存用户集合失败：");
                                $log.error(error);
                            })
                            .then(function () {
                                (callback || angular.noop)();
                            });
                }

                function find(key) {
                    if (list != null && list.length > 0) {
                        for (var i in list) {
                            if (key === list[i].Username) {
                                return list[i];
                            }
                        }
                    }
                    return null;
                }

                function addOrUpdate(item) {
                    var isExist = false;
                    if (list.length > 0) {
                        for (var i in list) {
                            if (item.Username === list[i].Username) {
                                list[i] = item;
                                isExist = true;
                                break;
                            }
                        }
                    }
                    if (!isExist) {
                        list.push(item);
                    }
                }

                return {
                    add: function (item) {
                        if (item === undefined || item === null || item.Username === undefined || item.Username === null) {
                            return false;
                        }
                        if (!isSync) {
                            fetch(function () {
                                addOrUpdate(item);
                            });
                        } else {
                            addOrUpdate(item);
                        }
                        return true;
                    },
                    remove: function (key) {
                        if (list.length > 0) {
                            for (var i in list) {
                                if (key === list[i].Username) {
                                    list.splice(i, 1);
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    get: function (key, callback) {
                        var returnVal;
                        if (!isSync) {
                            fetch(function () {
                                (callback || angular.noop)(angular.copy(find(key)));
                            });
                        }
                        else {
                            returnVal = angular.copy(find(key));
                            (callback || angular.noop)(returnVal);
                        }
                        return returnVal;
                    },
                    list: function (callback) {
                        var returnVal;
                        if (!isSync) {
                            fetch(function () {
                                (callback || angular.noop)(angular.copy(list));
                            });
                        }
                        else {
                            returnVal = angular.copy(list);
                            (callback || angular.noop)(returnVal);
                        }
                        return returnVal;
                    },
                    clear: function () {
                        list.length = 0;
                        isSync = false;
                    }
                }

            } ])
            .factory('categoryCache', ['$log', 'CategoryListService', function ($log, CategoryListService) {

                var map = [];

                function getScope(scope) {
                    for (var i in map) {
                        var entry = map[i];
                        if (scope === entry.scope) {
                            return entry;
                        }
                    }
                    return null;
                }

                function fetch(scope, callback) {
                    var scopeEntry;
                    CategoryListService.query({ 'scope': scope })
                        .$promise
                            .then(function (result) {
                                scopeEntry = getScope(scope);
                                if (scopeEntry === null) {
                                    scopeEntry = { 'scope': scope, 'list': [] };
                                    map.push(scopeEntry);
                                } else {
                                    scopeEntry.list.length = 0;
                                }
                                if (result != null && result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        scopeEntry.list.push(result[i]);
                                    }
                                }
                            }, function (error) {
                                $log.error("同步缓存范围为" + scope + "的类型集合失败：");
                                $log.error(error);
                            })
                            .then(function () {
                                (callback || angular.noop)(scopeEntry);
                            });
                }

                function find(key, scopeEntry) {
                    if (scopeEntry !== undefined && scopeEntry !== null) {
                        var list = scopeEntry.list;
                        if (list.length > 0) {
                            for (var i in list) {
                                if (key === list[i].Code) {
                                    return list[i];
                                }
                            }
                        }
                    }
                    return null;
                }

                function addOrUpdate(item, scopeEntry) {
                    var isExist = false;
                    if (scopeEntry !== undefined && scopeEntry !== null) {
                        var list = scopeEntry.list;
                        if (list.length > 0) {
                            for (var i in list) {
                                if (item.Code === list[i].Code) {
                                    list[i] = item;
                                    isExist = true;
                                    break;
                                }
                            }
                        }
                        if (!isExist) {
                            list.push(item);
                        }
                    }
                }

                return {
                    add: function (item) {
                        if (item === undefined || item === null
                            || item.Code === undefined || item.Code === null
                            || item.Scope === undefined || item.Scope === null) {
                            return false;
                        }
                        var scopeEntry = getScope(item.Scope);
                        if (scopeEntry === null || scopeEntry.list === 0) {
                            fetch(function (e) {
                                addOrUpdate(item, e);
                            });
                        } else {
                            addOrUpdate(item, scopeEntry);
                        }
                        return true;
                    },
                    remove: function (scope, key) {
                        var scopeEntry = getScope(scope);
                        if (scopeEntry !== null) {
                            var list = scopeEntry.list;
                            if (list !== null && list.length > 0) {
                                for (var i in list) {
                                    if (key === list[i].Code) {
                                        list.splice(i, 1);
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    },
                    get: function (scope, key, callback) {
                        var returnVal;
                        var scopeEntry = getScope(scope);
                        if (scopeEntry === null || scopeEntry.list === 0) {
                            fetch(scope, function (e) {
                                (callback || angular.noop)(angular.copy(find(key, e)));
                            });
                        }
                        else {
                            returnVal = angular.copy(find(key, scopeEntry));
                            (callback || angular.noop)(returnVal);
                        }
                        return returnVal;
                    },
                    list: function (scope, callback) {
                        var returnVal;
                        var scopeEntry = getScope(scope);
                        if (scopeEntry === null || scopeEntry.list === 0) {
                            fetch(scope, function (e) {
                                (callback || angular.noop)(angular.copy(getScope(scope).list));
                            });
                        }
                        else {
                            returnVal = angular.copy(scopeEntry.list);
                            (callback || angular.noop)(returnVal);
                        }
                        return returnVal;
                    },
                    listUsed: function (scope) {
                        var filter = [];
                        list(scope, function (e) {
                            if (e !== null && e.length > 0) {
                                for (var i = 0; i < e.length; i++) {
                                    if (e[i].Disused === false) {
                                        filter.push(e[i]);
                                    }
                                }
                            }
                        });
                        return filter;
                    },
                    clear: function (scope) {
                        for (var i in map) {
                            var entry = map[i];
                            if (scope == entry.scope) {
                                map.splice(i, 1);
                                break;
                            }
                        }
                    }
                }

            } ]);

});