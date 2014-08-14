'use strict';

define(function (require) {

    require('ng');
    require('ng-cookies');
    require('../../../static/js/configs');
    require('../../../static/js/events');
    require('../../../static/js/directives');
    require('./auth-models');
    require('./auth-services');

    require('../../../static/css/sign.css');

    angular.module('auth.controllers', ['ngCookies', 'configs', 'events', 'directives', 'auth.models', 'auth.services'])
        .controller('SignInCtrl', ['$scope', '$location', '$log', '$cookieStore', 'currentUser', 'eventbus', 'SignInService',
            function ($scope, $location, $log, $cookieStore, currentUser, eventbus, SignInService) {

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    $scope.isLoging = false;
                    $scope.login = {};

                    var usernameStored = $cookieStore.get('username');
                    if (usernameStored !== undefined) {
                        $scope.rememberMe = true;
                        $scope.login.username = usernameStored;
                        $scope.login.pwd = $cookieStore.get('pwd');
                    } else {
                        $scope.rememberMe = false;
                    }

                }

                $scope.signin = function () {

                    if ($scope.rememberMe) {
                        var usernameStored = $cookieStore.get('username');
                        if (usernameStored === undefined || usernameStored === null) {
                            $cookieStore.put('username', $scope.login.username);
                            $cookieStore.put('pwd', $scope.login.pwd);
                        }
                    } else {
                        $cookieStore.remove('username');
                        $cookieStore.remove('pwd')
                    }

                    $scope.alertMessageVisible = 'hidden';
                    $scope.isLoging = true;

                    var hashObj = new jsSHA($scope.login.pwd, 'TEXT');
                    var hashPwd = hashObj.getHash(
					    'SHA-1',
					    'B64',
					    parseInt(1, 10)
                    );

                    SignInService.save({
                        'username': $scope.login.username,
                        'pwd': hashPwd
                    })
                    .$promise
                        .then(function (result) {
                            currentUser.sign_in($scope.login.username, hashPwd);
                            currentUser.setDetails({ "name": result.Name, "roles": result.Roles });
                            eventbus.broadcast("userSignIn", $scope.login.username);
                            $location.path('/home/');
                        }, function (error) {
                            $scope.alertMessageVisible = 'show';
                            if (error.status == '400') {
                                $scope.alertMessage = "提示：无效的请求，" + error.data;
                            } else if (error.status == '403') {
                                $scope.alertMessage = "提示：登录密码错误，请重新输入密码";
                            } else if (error.status == '404') {
                                $scope.alertMessage = "提示：用户名" + $scope.login.username + "不存在";
                            } else {
                                $scope.alertMessage = "提示：登录操作失败";
                            }
                            $log.error(error);
                        })
                        .then(function () {
                            $scope.isLoging = false;
                        });
                }

            } ])
        .controller('SignUpCtrl', ['$scope', '$location', '$log', 'UserService', 'SignUpService', 'SignUpService2',
            function ($scope, $location, $log, UserService, SignUpService, SignUpService2) {

                var lastUsername;

                $scope.init = function () {
                    $scope.alertMessageVisible = 'hidden';
                    $scope.user = {};
                    $scope.isUserExisted = undefined;
                    lastUsername = $scope.user.username;
                    $scope.isSamePwd = true;
                    $scope.isBusy = false;
                }

                $scope.refreshCheckCode = function () {
                    $scope.$emit('refreshCheckCode');
                }

                $scope.usernameChanged = function () {
                    if (lastUsername != $scope.user.username && $scope.user.username != undefined && $scope.user.username != '') {
                        lastUsername = $scope.user.username;
                        $scope.usernameDisabled = true;
                        $scope.usernameStatus = "";
                        $scope.usernameFeedback = "fa-spin fa-spinner";
                        $scope.usernameFeedbackText = "";

                        SignUpService2.isUsernameExist($scope.user.username,
                            function (data, status) {
                                $scope.usernameDisabled = false;
                                if (data === 'false') {
                                    $scope.usernameStatus = "has-success";
                                    $scope.usernameFeedback = "fa-check";
                                } else {
                                    $scope.usernameStatus = "has-error";
                                    $scope.usernameFeedback = "fa-exclamation-triangle";
                                    $scope.usernameFeedbackText = "此用户名已被使用，请换一个。";
                                }
                            },
                            function (data, status) {
                                $scope.usernameDisabled = false;
                                $log.error(error);
                            });
                    } else if ($scope.user.username == undefined || $scope.user.username == "") {
                        $scope.usernameStatus = "";
                        $scope.usernameFeedback = "";
                        $scope.usernameFeedbackText = "";
                    }
                }

                $scope.pwd2Changed = function () {
                    $scope.isSamePwd = $scope.user.pwd != undefined & $scope.user.pwd2 != undefined
                                        & $scope.user.pwd2 == $scope.user.pwd;
                }

                $scope.signup = function () {

                    if ($scope.inputCheckcode === $scope.checkcode) {
                        $scope.alertMessageVisible = 'hidden';
                        $scope.isBusy = true;
                        SignUpService.save({
                            'username': $scope.user.username,
                            'pwd': $scope.user.pwd,
                            'name': $scope.user.name
                        })
                    .$promise
                        .then(function (result) {
                            $scope.isSuccess = true;
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：注册成功";
                        }, function (error) {
                            $scope.isSuccess = false;
                            $scope.alertMessageVisible = 'show';
                            $scope.alertMessage = "提示：注册失败";
                            $log.error(error);
                        })
                        .then(function () {
                            $scope.isBusy = false;
                        });
                    }
                    else {
                        $scope.alertMessageVisible = 'show';
                        $scope.alertMessage = "提示：验证码输入错误";
                        $scope.$emit('refreshCheckCode');
                    }

                }

            } ])
        .controller('SignOutCtrl', ['$scope', 'currentUser', 'eventbus',
            function ($scope, currentUser, eventbus) {

                $scope.init = function () {
                    currentUser.sign_out();
                    eventbus.broadcast("userSignOut", currentUser.username);
                }

            } ])
        .controller('SessionOutCtrl', ['$scope', '$location', 'currentUser', 'eventbus',
            function ($scope, $location, currentUser, eventbus) {

                $scope.init = function () {
                    currentUser.sign_out();
                    eventbus.broadcast("userSignOut", currentUser.username);
                }

            } ])
        .controller('NotAuthenticatedCtrl', ['$scope', 'currentUser', 'eventbus',
            function ($scope, currentUser, eventbus) {

                $scope.init = function () {
                    currentUser.sign_out();
                    eventbus.broadcast("userSignOut", currentUser.username);
                }

            } ]);

});