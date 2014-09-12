'use strict';

define(function (require) {

    require('ng');
    require('./project-services');
    require('../../auth/js/auth-models');
    require('../../common/js/common-cache');

    angular.module('participant.controllers', ['project.services', 'auth.models', 'common.cache'])
        .controller('ParticipantListCtrl', ['$scope', '$log', '$routeParams', 'currentUser', 'ParticipantService', 'ParticipantOfProjectService', 'userCache',
            function ($scope, $log, $routeParams, currentUser, ParticipantService, ParticipantOfProjectService, userCache) {

                function render(participant) {
                    userCache.get(participant.Staff, function (e) {
                        participant.staffName = (e == null) ? participant.Staff : e.Name;
                    });
                }

                function loadParticpantList() {
                    $scope.isParticipantLoading = true;
                    $scope.alertMessage = '';
                    ParticipantOfProjectService.query({ 'user': currentUser.getUsername(), 'projectId': $scope.projectId })
                        .$promise
                            .then(function (result) {
                                if (result != null) {
                                    for (var i = 0; i < result.length; i++) {
                                        var participant = result[i];
                                        if (currentUser.getUsername() === participant.Staff) {
                                            result.splice(i, 1);
                                            i--;
                                            continue;
                                        } else {
                                            render(participant);
                                        }
                                    }
                                }
                                $scope.participantList = result;
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessage = "提示：成员列表加载失败";
                            })
                            .then(function () {
                                $scope.isParticipantLoading = false;
                                $scope.users = [];
                                if ($scope.rawUsers != null) {
                                    var len = $scope.rawUsers.length;
                                    for (var i = 0; i < len; i++) {
                                        var user = $scope.rawUsers[i];
                                        var add = false;
                                        if (user.Username !== currentUser.getUsername() && user.Roles.indexOf('user') > -1) {
                                            //从全部用户列表判断此用户是否可以被加入项目。
                                            add = true;
                                        }
                                        //遍历本项目已参加的成员，以保证每个人员不会在同一项目上参加2次或以上。
                                        for (var j in $scope.participantList) {
                                            if (user.Username === $scope.participantList[j].Staff) {
                                                add = false;
                                                break;
                                            }
                                        }
                                        if (add) {
                                            $scope.users.push(user);
                                        }
                                    }
                                }
                            })
                }

                $scope.init = function () {
                    $scope.projectId = $routeParams.projectId;
                    userCache.list(function (result) {
                        $scope.rawUsers = result; //存储全部的用户列表。
                        loadParticpantList();
                    });
                }

                $scope.refresh = function () {
                    loadParticpantList();
                }

                $scope.addParticipant = function (user) {
                    $scope.alertMessage = '';
                    ParticipantService.save({ 'user': currentUser.getUsername(), 'projectId': $scope.projectId, 'participant': user.Username })
                        .$promise
                            .then(function (result) {
                                for (var i in $scope.users) {
                                    if (user.Username == $scope.users[i].Username) {
                                        $scope.users.splice(i, 1);
                                        break;
                                    }
                                }
                                render(result);
                                $scope.participantList.push(result);
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessage = "提示：添加成员失败";
                            });
                }

                $scope.removeParticipant = function (participant) {
                    $scope.alertMessage = '';
                    ParticipantService.remove({ 'user': currentUser.getUsername(), 'projectId': $scope.projectId, 'participant': participant.Staff })
                        .$promise
                            .then(function () {
                                for (var i in $scope.participantList) {
                                    if (participant.Staff == $scope.participantList[i].Staff) {
                                        $scope.participantList.splice(i, 1);
                                        break;
                                    }
                                }
                                for (var i in $scope.rawUsers) {
                                    if (participant.Staff == $scope.rawUsers[i].Username) {
                                        $scope.users.push($scope.rawUsers[i]);
                                        break;
                                    }
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessage = "提示：移除成员失败";
                            });
                }

            } ]);

});