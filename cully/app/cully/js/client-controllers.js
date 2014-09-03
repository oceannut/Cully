'use strict';

define(function (require) {

    require('ng');
    require('ng-local-storage');
    //require('jquery');
    //require('bootstrap');
    require('../../auth/js/auth-models');

    angular.module('client.controllers', ['LocalStorageModule', 'auth.models'])
        .controller('ClientSettingCtrl', ['$scope', '$location', '$log', '$anchorScroll', 'localStorageService', 'currentUser',
            function ($scope, $location, $log, $anchorScroll, localStorageService, currentUser) {

                $scope.init = function () {

                    $('#menu').affix();

                    $scope.userData = {
                        'animation': true,
                        'caution': 60,
                        'cautionByMusic': 'true',
                        'caution4Task': 'false'
                    };

                    var username = currentUser.getUsername();
                    var caution = localStorageService.get(username + '.caution');
                    if (caution !== null) {
                        $scope.userData.caution = caution;
                    }

                }

                $scope.gotoAnchor = function (anchor) {
                    $location.hash(anchor);
                    $anchorScroll();
                }

                $scope.save = function () {
                    var username = currentUser.getUsername();
                    localStorageService.set(username + '.caution', $scope.userData.caution);
                }

            } ]);

});