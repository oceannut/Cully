'use strict';

define(function (require) {

    require('ng');
    require('bootstrap');
    require('../../../static/js/configs');
    require('../../../static/js/events');
    require('../../auth/js/auth-models');
    require('./user-services');

    angular.module('user.controllers', ['configs', 'user.services'])
        .controller('UserRoleOverviewCtrl', ['$scope', '$routeParams', '$log', 'UserService', 'UserListService', 'RoleConfigService', 'currentUser',
            function ($scope, $routeParams, $log, UserService, UserListService, RoleConfigService, currentUser) {

                $scope.init = function () {
                    var which = $routeParams.which;
                    if ("user" === which) {
                        $('#tab a[href="#user"]').tab('show');
                    } else if ("role" === which) {
                        $('#tab a[href="#role"]').tab('show');
                    }

                    $scope.alertMessageVisible = 'hidden';
                    UserListService.query()
                        .$promise
                            .then(function (result) {
                                $scope.userList = result;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载用户列表失败";
                                $log.error(error);
                            });
                    RoleConfigService.query()
                        .$promise
                            .then(function (result) {
                                $scope.roleList = result;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载角色列表失败";
                                $log.error(error);
                            });
                }

                $scope.selectUser = function (item) {
                    $scope.selectedUser = item;
                }

                $scope.removeUser = function () {
                    $scope.alertMessageVisible = 'hidden';
                    if (currentUser.getUsername() === $scope.selectedUser.Username) {
                        $('#removeUserDialog').modal('hide');
                        $scope.alertMessageVisible = 'show';
                        $scope.alertMessage = "提示：登录用户不能删除自己";
                        return;
                    }
                    UserService.remove({ "username": $scope.selectedUser.Username })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.userList) {
                                    if ($scope.selectedUser.Username == $scope.userList[i].Username) {
                                        $scope.userList.splice(i, 1);
                                        break;
                                    }
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：删除用户失败";
                                $log.error(error);
                            })
                            .then(function () {
                                $('#removeUserDialog').modal('hide');
                            });
                }

            } ])
        .controller('UserRoleAssignCtrl', ['$scope', '$routeParams', '$log', 'UserService', 'RoleConfigService', 'RoleService',
            function ($scope, $routeParams, $log, UserService, RoleConfigService, RoleService) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';

                    RoleConfigService.query()
                        .$promise
                            .then(function (result) {
                                $scope.roleList = result;
                                for (var i = 0; i < $scope.roleList.length; i++) {
                                    $scope.roleList[i].checked = false;
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载角色列表失败";
                                $log.error(error);
                            })
                            .then(function () {
                                return UserService.get({ "username": $routeParams.username }).$promise;
                            })
                            .then(function (result) {
                                $scope.user = result;
                                var roles = $scope.user.Roles;
                                if (roles != undefined && roles != null) {
                                    for (var i = 0; i < roles.length; i++) {
                                        for (var j = 0; j < $scope.roleList.length; j++) {
                                            if (roles[i] === $scope.roleList[j].id) {
                                                $scope.roleList[j].checked = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载用户失败";
                                $log.error(error);
                            });
                }

                $scope.checkRole = function (item) {
                    $scope.user.Roles = $scope.user.Roles || [];
                    if (item.isSelected) {
                        RoleService.save({ "username": $scope.user.Username, "role": item.id })
                            .$promise
                                .then(function (result) {
                                    $scope.user.Roles.push(item.id);
                                }, function (error) {
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：为用户分配角色失败";
                                    $log.error(error);
                                });
                    } else {
                        RoleService.remove({ "username": $scope.user.Username, "role": item.id })
                            .$promise
                                .then(function (result) {
                                    for (var i in $scope.user.Roles) {
                                        if (item.id === $scope.user.Roles[i]) {
                                            $scope.user.Roles.splice(i, 1);
                                            break;
                                        }
                                    }
                                }, function (error) {
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：为用户分配角色失败";
                                    $log.error(error);
                                });
                    }
                }

            } ])
        .controller('RoleUserAssignCtrl', ['$scope', '$routeParams', '$log', 'UserListService', 'RoleConfigService', 'RoleService',
            function ($scope, $routeParams, $log, UserListService, RoleConfigService, RoleService) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';

                    RoleConfigService.query()
                        .$promise
                            .then(function (result) {
                                for (var i = 0; i < result.length; i++) {
                                    if ($routeParams.role == result[i].id) {
                                        $scope.role = result[i];
                                        break;
                                    }
                                }
                            }, function (error) {
                                $scope.role = $routeParams.role;
                                $log.error(error);
                            });

                    UserListService.query()
                        .$promise
                            .then(function (result) {
                                $scope.unassignUserList = [];
                                $scope.assignUserList = [];
                                if (result != null && result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        var user = result[i];
                                        user.Roles = user.Roles || [];
                                        if (user.Roles.indexOf($routeParams.role) > -1) {
                                            $scope.assignUserList.push(result[i]);
                                        } else {
                                            $scope.unassignUserList.push(result[i]);
                                        }
                                    }
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载用户列表失败";
                                $log.error(error);
                            });

                }

                $scope.assign = function (item) {
                    RoleService.save({ "username": item.Username, "role": $scope.role.id })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.unassignUserList) {
                                    if (item === $scope.unassignUserList[i]) {
                                        $scope.unassignUserList.splice(i, 1);
                                        break;
                                    }
                                }
                                $scope.assignUserList.push(item);
                                item.Roles = item.Roles || [];
                                item.Roles.push($routeParams.role);
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：为角色分配用户失败";
                                $log.error(error);
                            });
                }

                $scope.unassign = function (item) {
                    RoleService.remove({ "username": item.Username, "role": $scope.role.id })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.assignUserList) {
                                    if (item === $scope.assignUserList[i]) {
                                        $scope.assignUserList.splice(i, 1);
                                        break;
                                    }
                                }
                                $scope.unassignUserList.push(item);
                                item.Roles = item.Roles || [];
                                for (var i in item.Roles) {
                                    if ($routeParams.role == item.Roles[i]) {
                                        item.Roles.splice(i, 1);
                                    }
                                }
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：为角色分配用户失败";
                                $log.error(error);
                            });
                }

            } ])
        .controller('UserSettingCtrl', ['$scope', '$routeParams', '$log', 'UserService', 'currentUser', 'eventbus',
            function ($scope, $routeParams, $log, UserService, currentUser, eventbus) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    $scope.user = {};
                    $scope.isBusy = false;

                    UserService.get({ "username": $routeParams.username })
                        .$promise
                            .then(function (result) {
                                $scope.user = result;
                            }, function (error) {
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：加载用户失败";
                                $log.error(error);
                            });
                }

                $scope.save = function () {
                    UserService.update({
                        'username': $scope.user.Username,
                        'name': $scope.user.Name,
                        'group': null
                    })
                    .$promise
                        .then(function (result) {
                            $scope.isSuccess = true;
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：修改成功";
                            currentUser.setDetails({ "name": $scope.user.Name, "roles": $scope.user.Roles });
                            eventbus.broadcast("userModified", $scope.user.Username);
                        }, function (error) {
                            $scope.isSuccess = false;
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：修改失败";
                            $log.error(error);
                        })
                        .then(function () {
                            $scope.isBusy = false;
                        });
                }

            } ]);

});