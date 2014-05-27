﻿'use strict';

define(function (require) {

    require('route');
    require('./project-controllers');
    require('../../../static/js/utils');
    require('../../../static/js/configs');

    angular.module('CullyApp', ['ngRoute', 'project.controllers', 'utils', 'configs'])
        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider.
                when('/overview/', {
                    templateUrl: 'partials/overview.htm'
                }).
                when('/project-list/', {
                    templateUrl: 'partials/project-list.htm',
                    controller: 'ProjectListCtrl'
                }).
                when('/project-add/', {
                    templateUrl: 'partials/project-add.htm',
                    controller: 'ProjectAddCtrl'
                }).
                when('/project-details/', {
                    templateUrl: 'partials/project-details.htm',
                    controller: 'ProjectDetailsCtrl'
                }).
                when('/activity-add/', {
                    templateUrl: 'partials/activity-add.htm',
                    controller: 'ActivityAddCtrl'
                }).
                otherwise({
                    redirectTo: '/project-list/'
                });

        } ])
        .controller('MainCtrl', ['$scope', 'currentUser', 'urlUtil',
            function ($scope, currentUser, urlUtil) {

                currentUser.username = urlUtil.getUrlParam('username');

            } ]);

    return {
        init: function () {
            angular.bootstrap(document, ['CullyApp']);
        }
    }

});