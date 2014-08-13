'use strict';

define(function (require) {

    require('ng');
    require('../../../static/js/configs');
    require('../../../static/js/filters');
    require('./project-services');
    require('../../common/js/user-services');

    angular.module('participant.controllers', ['configs', 'filters', 'project.services', 'user.services'])
        .controller('ParticipantListCtrl', ['$scope', '$location', '$log', '$routeParams', 'currentUser', 'ParticipantService',
                    'ParticipantOfProjectService', 'dateUtil', 'userCacheUtil',
            function ($scope, $location, $log, $routeParams, currentUser, ParticipantService,
                     ParticipantOfProjectService, dateUtil, userCacheUtil) {

                $scope.isParticipantLoading = false;
                $scope.alertMessageVisible = 'hidden';

                function render(participant) {
                    var user = userCacheUtil.get(participant.Staff);
                    participant.staffName = (user == null) ? participant.Staff : user.Name;
                }

                $scope.gotoback = function () {
                    history.back();
                }

                $scope.init = function () {
                    $scope.isParticipantLoading = true;
                    ParticipantOfProjectService.query({ 'user': currentUser.username, 'projectId': $routeParams.projectId })
                        .$promise
                            .then(function (result) {
                                $scope.participantList = result;
                                for (var i in $scope.participantList) {
                                    render($scope.participantList[i]);
                                }
                            }, function (error) {
                                $log.error(error);
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：成员列表加载失败";
                            })
                            .then(function () {
                                $scope.users = [];
                                userCacheUtil.list(function (result) {
                                    $scope.rawUsers = result;
                                    if (result != null) {
                                        for (var i = 0; i < result.length; i++) {
                                            var add = false;
                                            if (result[i].Username != currentUser.username) {
                                                add = true;
                                            }
                                            for (var j in $scope.participantList) {
                                                if (result[i].Username == $scope.participantList[j].Staff) {
                                                    add = false;
                                                    break;
                                                }
                                            }
                                            if (add) {
                                                $scope.users.push(result[i]);
                                            }
                                        }
                                    }
                                }, function (error) {
                                    $log.error(error);
                                    $scope.alertMessageVisible = 'show';
                                    $scope.alertMessage = "提示：成员列表加载失败";
                                }, function () {
                                    $scope.isParticipantLoading = false;
                                });
                            });
                }

                $scope.addParticipant = function (user) {
                    ParticipantService.save({ 'user': currentUser.username, 'projectId': $routeParams.projectId, 'participant': user.Username })
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
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：添加成员失败";
                            });
                }

                $scope.removeParticipant = function (participant) {
                    ParticipantService.remove({ 'user': currentUser.username, 'projectId': $routeParams.projectId, 'participant': participant.Staff })
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
                                $scope.alertMessageVisible = 'show';
                                $scope.alertMessage = "提示：移除成员失败";
                            });
                }

            } ]);

});