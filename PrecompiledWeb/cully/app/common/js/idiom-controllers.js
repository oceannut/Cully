'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/filters');
    require('../../../static/js/utils');
    require('./idiom-services');

    angular.module('idiom.controllers', ['filters', 'utils', 'idiom.services'])
        .controller('IdiomOverviewCtrl', ['$scope', '$location', '$log', 'IdiomConfigService',
            function ($scope, $location, $log, IdiomConfigService) {

                $scope.init = function () {
                    IdiomConfigService.query()
                        .$promise
                            .then(function (result) {
                                $scope.scopeList = result;
                            }, function (error) {
                                $log.error(error);
                            });
                }

            } ])
        .factory("idimoList", function () {

            var list;

            return {
                init: function (col) {
                    list = col;
                },
                get: function (id) {
                    if (id !== undefined && id !== null && id !== 0) {
                        for (var i in list) {
                            var item = list[i];
                            if (parseInt(id) === item.Id) {
                                return item;
                            }
                        }
                    }
                    return null;
                },
                update: function (entity) {
                    if (entity !== undefined && entity !== null) {
                        var found = this.get(entity.Id);
                        if (found !== null) {
                            found.Content = entity.Content;
                        } else {
                            list.push(entity);
                        }
                    }
                },
                del: function (id) {
                    if (id !== undefined && id !== null && id !== 0) {
                        for (var i in list) {
                            var item = list[i];
                            if (parseInt(id) === item.Id) {
                                list.splice(i, 1);
                                break;
                            }
                        }
                    }
                },
                getList: function () {
                    return list;
                }
            }

        })
        .controller('IdiomListCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'IdiomListService', 'IdiomService', 'idimoList',
            function ($scope, $location, $log, $routeParams, currentUser, IdiomListService, IdiomService, idimoList) {

                $scope.init = function () {
                    $scope.scope = $routeParams.scope;
                    $scope.alertMessageVisible = 'hidden';
                    $scope.idiomList = idimoList.getList();
                    if ($scope.idiomList === undefined || $scope.idiomList === null) {
                        IdiomListService.query({ 'scope': $routeParams.scope })
                        .$promise
                            .then(function (result) {
                                $scope.idiomList = result;
                                idimoList.init(result);
                            }, function (error) {
                                scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：获取短语列表失败";
                                $log.error(error);
                            });
                    }
                }

                $scope.select = function (item) {
                    $scope.selectedItem = item;
                }

                $scope.remove = function () {
                    IdiomService.remove({ "scope": $scope.scope,
                        "id": $scope.selectedItem.Id
                    })
                        .$promise
                            .then(function (result) {
                                idimoList.del($scope.selectedItem.Id);
                                $scope.idiomList = idimoList.getList();
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：删除短语失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $('#removeDialog').modal('hide');
                            });
                }

            } ])
        .controller('IdiomEditCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'IdiomService', 'idimoList',
            function ($scope, $location, $log, $routeParams, currentUser, IdiomService, idimoList) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    $scope.isLoading = false;

                    $scope.idiom = {}
                    $scope.idiom.Scope = $routeParams.scope;
                    $scope.idiom.Id = $routeParams.id;
                    if ($scope.idiom.Id != null && $scope.idiom.Id != '') {
                        if ($scope.idiom.Id === '0') {
                            $scope.actionModeIcon = "fa-plus";
                            $scope.actionMode = "添加";
                        } else {
                            $scope.actionModeIcon = "fa-edit";
                            $scope.actionMode = "编辑";
                            var found = idimoList.get($scope.idiom.Id);
                            if (found !== null) {
                                $scope.idiom.Content = found.Content;
                            }
                        }
                    }
                }

                $scope.clear = function () {
                    $scope.actionModeIcon = "fa-plus";
                    $scope.actionMode = "添加";
                    $scope.idiom.Id = '0';
                    $scope.idiom.Content = '';
                    $scope.alertMessageVisible = 'hidden';
                }

                $scope.save = function () {
                    if ($scope.idiom.Id != null && $scope.idiom.Id != '') {
                        $scope.isLoading = true;
                        if ($scope.idiom.Id === '0') {
                            IdiomService.save({ "scope": $scope.idiom.Scope, 'content': $scope.idiom.Content })
                                .$promise
                                    .then(function (result) {
                                        $scope.idiom.Id = result.Id;
                                        idimoList.update(result);
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-success';
                                        $scope.alertMessage = "提示：保存短语成功";
                                    }, function (error) {
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-danger';
                                        $scope.alertMessage = "提示：添加短语失败";
                                        $log.error(error);
                                    })
                                    .then(function () {
                                        $scope.isLoading = false;
                                    });
                        } else {
                            IdiomService.update({ "scope": $scope.idiom.Scope,
                                "id": $scope.idiom.Id,
                                'content': $scope.idiom.Content
                            })
                                .$promise
                                    .then(function (result) {
                                        idimoList.update(result);
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-success';
                                        $scope.alertMessage = "提示：保存短语成功";
                                    }, function (error) {
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-danger';
                                        $scope.alertMessage = "提示：修改短语失败";
                                        $log.error(error);
                                    })
                                    .then(function () {
                                        $scope.isLoading = false;
                                    });

                        }
                    }

                }

            } ]);

});