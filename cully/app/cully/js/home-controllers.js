'use strict';

define(function (require) {

    require('ng');

    require('../../common/js/common-cache');

    angular.module('home.controllers', ['common.cache'])
        .controller('HomeCtrl', ['$scope', '$location', '$log', 'currentUser', 'userCache', 'categoryCache',
            function ($scope, $location, $log, currentUser, userCache, categoryCache) {

                $scope.init = function () {

                    userCache.list();
                    categoryCache.list("activity");
                    categoryCache.list("log");

                }

            } ]);

});