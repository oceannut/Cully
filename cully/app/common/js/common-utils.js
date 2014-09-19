'use strict';

define(function (require) {

    require('ng');
    require('underscore');

    require('../../../static/js/utils');
    require('../../auth/js/auth-models');
    require('./common-cache');

    angular.module('common.utils', ['utils', 'auth.models', 'common.cache'])
        .factory('commonUtil', ['$log', 'listUtil', 'currentUser', 'userCache', 'categoryCache',
            function ($log, listUtil, currentUser, userCache, categoryCache) {

                function bindUserList(targetList, includeSelf, includeRoles) {
                    userCache.list(function (result) {
                        listUtil.shallowCopyList(targetList, result, false, function (e) {
                            //return (e.Username !== currentUser.getUsername() & e.Roles.indexOf('user') > -1);
                            var flag = true;
                            if (includeSelf) {
                                //do nothing
                            } else {
                                flag = flag & (e.Username !== currentUser.getUsername());
                            }
                            if (flag) {
                                if (includeRoles) {
                                    if (_.isArray(includeRoles)) {
                                        flag = flag & _.some(includeRoles, function (item) {
                                            return e.Roles.indexOf(item) > -1;
                                        });
                                    } else if (_.isString(includeRoles)) {
                                        flag = flag & (e.Roles.indexOf(includeRoles) > -1);
                                    } else {
                                        flag = flag & (e.Roles.indexOf('user') > -1);
                                    }
                                } else {
                                    flag = flag & (e.Roles.indexOf('user') > -1);
                                }
                            }
                            return flag;
                        });
                    });
                }

                function bindCategoryList(targetList, scope, selected, func) {
                    if (angular.isUndefined(scope)) {
                        $log.error("undefined scope");
                        return;
                    }
                    categoryCache.list(scope, function (result) {
                        listUtil.shallowCopyList(targetList, result, false);
                        if (angular.isString(selected)) {
                            selectCategory(targetList, selected, function (e) {
                                (func || angular.noop)(e);
                            });
                        }
                    });
                }

                function selectCategory(list, code, func) {
                    if (list !== undefined && list !== null && code !== undefined && code !== null) {
                        for (var i = 0; i < list.length; i++) {
                            var item = list[i];
                            if (item.Code === code) {
                                item.active = "active";
                                (func || angular.noop)(item);
                            } else {
                                item.active = "";
                            }
                        }
                    }
                }

                function buildCreatorName(entity) {
                    if (angular.isObject(entity) && angular.isDefined(entity.Creator)) {
                        userCache.get(entity.Creator, function (e) {
                            entity.creatorName = (e == null) ? entity.Creator : e.Name;
                        });
                    }
                }

                function buildCategoryIcon(entity, scope, defaultIcon) {
                    if (angular.isUndefined(scope)) {
                        $log.error("undefined scope");
                        return;
                    }
                    if (angular.isObject(entity) && angular.isDefined(entity.Category)) {
                        entity.icon = defaultIcon;
                        categoryCache.get(scope, entity.Category, function (e) {
                            entity.icon = (e == null) ? defaultIcon : e.Icon;
                        });
                    }
                }

                return {
                    bindUserList: bindUserList,
                    bindCategoryList: bindCategoryList,
                    selectCategory: selectCategory,
                    buildCreatorName: buildCreatorName,
                    buildCategoryIcon: buildCategoryIcon
                }
            } ]);

});