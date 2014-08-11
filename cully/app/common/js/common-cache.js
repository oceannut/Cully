'use strict';

define(function (require) {

    angular.module('common.cache', [])
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
                                (callback || angular.noop)();
                            }, function (error) {
                                isSync = false;
                                $log.error("同步缓存用户集合失败：");
                                $log.error(error);
                            });
                }

                function find(key) {
                    if (list != null && list.length > 0) {
                        for (var i in list) {
                            if (key == list[i].Username) {
                                return list[i];
                            }
                        }
                    }
                    return null;
                }

                function addOrUpdate(item) {
                    var isExist = false;
                    if (list != null && list.length > 0) {
                        for (var i in list) {
                            if (item.Username == list[i].Username) {
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
                        if (item == undefined || item == null || item.Username == undefined || item.Username == null) {
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
                        if (list != null && list.length > 0) {
                            for (var i in list) {
                                if (key == list[i].Username) {
                                    list.splice(i, 1);
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    getAsync: function (key, callback) {
                        if (!isSync) {
                            fetch(function () {
                                (callback || angular.noop)(find(key));
                            });
                        }
                        else {
                            (callback || angular.noop)(find(key));
                        }
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
                        if (scope == entry.scope) {
                            return entry;
                        }
                    }
                    return null;
                }

                function fetch(scope, callback) {
                    CategoryListService.query({ 'scope': scope })
                        .$promise
                            .then(function (result) {
                                var list = [];
                                if (result != null && result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        list.push(result[i]);
                                    }
                                }
                                var scopeEntry = { 'scope': scope, 'list': list };
                                map.push(scopeEntry);
                                (callback || angular.noop)(scopeEntry);
                            }, function (error) {
                                $log.error("同步缓存范围为" + scope + "的类型集合失败：");
                                $log.error(error);
                            });
                }

                function find(key, scopeEntry) {
                    var list = scopeEntry.list;
                    if (list != null && list.length > 0) {
                        for (var i in list) {
                            if (key == list[i].Code) {
                                return list[i];
                            }
                        }
                    }
                    return null;
                }

                function addOrUpdate(item, scopeEntry) {
                    var isExist = false;
                    var list = scopeEntry.list;
                    if (list != null && list.length > 0) {
                        for (var i in list) {
                            if (item.Code == list[i].Code) {
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
                        if (item == undefined || item == null
                            || item.Code == undefined || item.Code == null
                            || item.Scope == undefined || item.Scope == null) {
                            return false;
                        }
                        var scopeEntry = getScope(item.Scope);
                        if (scopeEntry == null) {
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
                        if (scopeEntry != null) {
                            var list = scopeEntry.list;
                            if (list != null && list.length > 0) {
                                for (var i in list) {
                                    if (key == list[i].Code) {
                                        list.splice(i, 1);
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    },
                    getAsync: function (scope, key, callback) {
                        var scopeEntry = getScope(scope);
                        if (scopeEntry == null) {
                            fetch(function (e) {
                                (callback || angular.noop)(find(key, e));
                            });
                        }
                        else {
                            (callback || angular.noop)(find(key, scopeEntry));
                        }
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