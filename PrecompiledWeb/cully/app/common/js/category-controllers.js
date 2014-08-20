'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/configs');
    require('./category-services');

    angular.module('category.controllers', ['configs', 'category.services'])
        .factory("scopes", function () {

            var list = [];

            return {
                init: function (scopeCatalog) {
                    if (scopeCatalog != undefined && scopeCatalog != null) {
                        for (var i = 0; i < scopeCatalog.length; i++) {
                            var scopes = scopeCatalog[i].scopes;
                            for (var j = 0; j < scopes.length; j++) {
                                list.push(scopes[j]);
                            }
                        }
                    }
                },
                get: function (key) {
                    if (key != null && key != "") {
                        for (var i in list) {
                            var item = list[i];
                            if (key == item.code) {
                                return item;
                            }
                        }
                    }
                    return null;
                }
            }

        })
        .controller('CategoryOverviewCtrl', ['$scope', '$location', '$log', 'CategoryConfigService', 'scopes',
            function ($scope, $location, $log, CategoryConfigService, scopes) {

                $scope.init = function () {
                    CategoryConfigService.query()
                        .$promise
                            .then(function (result) {
                                $scope.scopeCatalog = result;
                                scopes.init($scope.scopeCatalog);
                            }, function (error) {
                                $log.error(error);
                            });
                }

            } ])
        .controller('CategoryListCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'scopes', 'CategoryListService', 'CategoryService',
            function ($scope, $location, $log, $routeParams, currentUser, scopes, CategoryListService, CategoryService) {

                $scope.init = function () {

                    $scope.alertMessageVisible = 'hidden';

                    var scope = scopes.get($routeParams.scope);
                    $scope.scopeName = scope == null ? $routeParams.scope : scope.name;
                    $scope.scope = $routeParams.scope;

                    CategoryListService.query({ "scope": $routeParams.scope })
                        .$promise
                            .then(function (result) {
                                $scope.categoryList = result;
                            }, function (error) {
                                scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：获取" + $scope.scopeName + "列表失败";
                                $log.error(error);
                            });

                }

                $scope.select = function (item) {
                    $scope.selectedItem = item;
                }

                $scope.remove = function () {
                    CategoryService.remove({ "scope": $scope.scope,
                        "id": $scope.selectedItem.Id
                    })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.categoryList) {
                                    if ($scope.selectedItem.Id == $scope.categoryList[i].Id) {
                                        $scope.categoryList.splice(i, 1);
                                        break;
                                    }
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：删除" + $scope.scopeName + "失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $('#removeDialog').modal('hide');
                            });
                }

            } ])
        .controller('CategoryEditCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'scopes', 'CodeCategoryService', 'CategoryService',
            function ($scope, $location, $log, $routeParams, currentUser, scopes, CodeCategoryService, CategoryService) {

                var lastCode;

                $scope.init = function () {

                    $scope.category = {}

                    var scope = scopes.get($routeParams.scope);
                    $scope.scopeName = scope == null ? $routeParams.scope : scope.name;
                    $scope.category.Scope = $routeParams.scope;
                    $scope.category.Id = $routeParams.id;
                    if ($scope.category.Id != null && $scope.category.Id != '') {
                        if ($scope.category.Id === '0') {
                            $scope.actionModeIcon = "fa-plus";
                            $scope.actionMode = "添加";
                        } else {
                            $scope.actionModeIcon = "fa-edit";
                            $scope.actionMode = "编辑";
                            CategoryService.get({ "scope": $routeParams.scope,
                                "id": $scope.category.Id
                            })
                                .$promise
                                    .then(function (result) {
                                        $scope.category = result;
                                    }, function (error) {
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-danger';
                                        $scope.alertMessage = "提示：获取" + $scope.scopeName + "失败";
                                        $log.error(error);
                                    })
                                    .then(function () {
                                        $scope.isLoading = false;
                                    });
                        }
                    }

                    $scope.alertMessageVisible = 'hidden';
                    $scope.isLoading = false;
                    lastCode = $scope.category.Code;
                    $scope.codeDisabled = false;

                }

                $scope.codeChanged = function () {
                    if (lastCode != $scope.category.Code && $scope.category.Code != undefined && $scope.category.Code != '') {
                        lastCode = $scope.category.Code;
                        $scope.codeDisabled = true;
                        $scope.codeStatus = "";
                        $scope.codeFeedback = "fa-spin fa-spinner";
                        $scope.codeFeedbackText = "";

                        CodeCategoryService.get({ "scope": $routeParams.scope, "code": $scope.category.Code })
                            .$promise
                                .then(function (result) {
                                    if (result.Code == undefined) {
                                        $scope.codeStatus = "has-success";
                                        $scope.codeFeedback = "fa-check";
                                    } else {
                                        $scope.codeStatus = "has-error";
                                        $scope.codeFeedback = "fa-exclamation-triangle";
                                        $scope.codeFeedbackText = "此编码已被使用，请换一个。";
                                    }
                                }, function (error) {
                                    $log.error(error);
                                })
                                .then(function () {
                                    $scope.codeDisabled = false;
                                });

                    } else if ($scope.category.Code == undefined || $scope.category.Code == "") {
                        $scope.codeStatus = "";
                        $scope.codeFeedback = "";
                        $scope.codeFeedbackText = "";
                    }
                }

                $scope.clear = function () {
                    $scope.actionModeIcon = "fa-plus";
                    $scope.actionMode = "添加";
                    $scope.category.Id = '0';
                    $scope.category.Name = '';
                    $scope.category.Code = '';
                    $scope.category.Description = '';
                    lastCode = $scope.category.Code;
                    $scope.alertMessageVisible = 'hidden';
                }

                $scope.save = function () {
                    if ($scope.category.Id != null && $scope.category.Id != '') {
                        $scope.isLoading = true;
                        if ($scope.category.Id === '0') {
                            CategoryService.save({ "scope": $routeParams.scope,
                                "parentId": '',
                                "name": $scope.category.Name,
                                "code": $scope.category.Code,
                                "description": $scope.category.Description,
                                "icon": '',
                                "sequence": '0'
                            })
                                .$promise
                                    .then(function (result) {
                                        $scope.category.Id = result.Id;
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-success';
                                        $scope.alertMessage = "提示：保存" + $scope.scopeName + "成功";
                                    }, function (error) {
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-danger';
                                        $scope.alertMessage = "提示：添加" + $scope.scopeName + "失败";
                                        $log.error(error);
                                    })
                                    .then(function () {
                                        $scope.isLoading = false;
                                    });
                        } else {
                            CategoryService.update({ "scope": $routeParams.scope,
                                "id": $scope.category.Id,
                                "parentId": null,
                                "name": $scope.category.Name,
                                "code": $scope.category.Code,
                                "description": $scope.category.Description,
                                "icon": null,
                                "sequence": '0'
                            })
                                .$promise
                                    .then(function (result) {
                                        $scope.category.Id = result.Id;
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-success';
                                        $scope.alertMessage = "提示：保存" + $scope.scopeName + "成功";
                                    }, function (error) {
                                        $scope.alertMessageVisible = 'show';
                                        $scope.alertMessageColor = 'alert-danger';
                                        $scope.alertMessage = "提示：修改" + $scope.scopeName + "失败";
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