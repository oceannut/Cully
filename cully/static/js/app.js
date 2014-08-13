'use strict';

define(function (require) {

    require('ng-route');

    require('../../app/auth/js/auth-controllers');
    require('../../app/common/js/user-controllers');
    require('../../app/cully/js/biz-notification-controllers');
    require('../../app/cully/js/index-controllers');
    require('../../app/cully/js/home-controllers');
    require('../../app/cully/js/project-controllers');
    require('../../app/cully/js/activity-controllers');
    require('../../app/cully/js/task-controllers');
    require('../../app/cully/js/participant-controllers');
    require('../../app/cully/js/log-controllers');

    angular.module('Cully', ['ngRoute',
            'auth.controllers',
            'user.controllers',
            'bizNotification.controllers',
            'index.controllers',
            'home.controllers',
            'project.controllers',
            'activity.controllers',
            'task.controllers',
            'participant.controllers',
            'log.controllers'
        ])
        .config(['$routeProvider', '$httpProvider',
            function ($routeProvider, $httpProvider) {

                $routeProvider
                    .when('/sign-in/', {
                        templateUrl: 'app/auth/partials/sign-in.htm',
                        controller: 'SignInCtrl'
                    })
                    .when('/sign-up/', {
                        templateUrl: 'app/auth/partials/sign-up.htm',
                        controller: 'SignUpCtrl'
                    })
                    .when('/sign-out/', {
                        templateUrl: 'app/auth/partials/sign-out.htm',
                        controller: 'SignOutCtrl'
                    })
                    .when('/not-authorised/', {
                        templateUrl: 'app/auth/partials/not-authorised.htm'
                    })
                    .when('/not-authenticated/', {
                        templateUrl: 'app/auth/partials/not-authenticated.htm',
                        controller: 'NotAuthenticatedCtrl'
                    })
                    .when('/session-out/', {
                        templateUrl: 'app/auth/partials/session-out.htm',
                        controller: 'SessionOutCtrl'
                    })
                    .when('/user-setting/:username/', {
                        templateUrl: 'app/common/partials/user-setting.htm',
                        controller: 'UserSettingCtrl',
                        access: {
                            loginRequired: true
                        }
                    })
                    .when('/home/', {
                        templateUrl: 'app/cully/partials/home.htm',
                        controller: 'HomeCtrl',
                        access: {
                            loginRequired: true
                        }
                    })
                    .when('/project-summary/', {
                        templateUrl: 'app/cully/partials/project-summary.htm',
                        controller: 'ProjectSummaryCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/project-add/', {
                        templateUrl: 'app/cully/partials/project-add.htm',
                        controller: 'ProjectAddCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['supvisor']
                        }
                    })
                    .when('/project-details/:id/', {
                        templateUrl: 'app/cully/partials/project-details.htm',
                        controller: 'ProjectDetailsCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/project-edit/:id/', {
                        templateUrl: 'app/cully/partials/project-edit.htm',
                        controller: 'ProjectEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['supvisor']
                        }
                    })
                    .when('/activity-add/', {
                        templateUrl: 'app/cully/partials/activity-add.htm',
                        controller: 'ActivityAddCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['supvisor']
                        }
                    })
                    .when('/activity-details/:id/', {
                        templateUrl: 'app/cully/partials/activity-details.htm',
                        controller: 'ActivityDetailsCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/activity-edit/:id/', {
                        templateUrl: 'app/cully/partials/activity-edit.htm',
                        controller: 'ActivityEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['supvisor']
                        }
                    })
                    .when('/task-edit/:id/', {
                        templateUrl: 'app/cully/partials/task-edit.htm',
                        controller: 'TaskEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['supvisor']
                        }
                    })
                    .when('/task-details/:id/', {
                        templateUrl: 'app/cully/partials/task-details.htm',
                        controller: 'TaskDetailsCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/task-notification-list/:id/', {
                        templateUrl: 'app/cully/partials/task-notification-list.htm',
                        controller: 'TaskNotificationListCtrl'
                    })
                    .when('/participant-list/:projectId/', {
                        templateUrl: 'app/cully/partials/participant-list.htm',
                        controller: 'ParticipantListCtrl'
                    })
                    .when('/log-summary/', {
                        templateUrl: 'app/cully/partials/log-summary.htm',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/log-add/', {
                        templateUrl: 'app/cully/partials/log-add.htm',
                        controller: 'LogAddCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user']
                        }
                    })
                    .when('/log-edit/:id/', {
                        templateUrl: 'app/cully/partials/log-edit.htm',
                        controller: 'LogEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user']
                        }
                    })
                    .when('/log-details/:id/', {
                        templateUrl: 'app/cully/partials/log-details.htm',
                        controller: 'LogDetailsCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user']
                        }
                    })
                    .when('/notification-list/', {
                        templateUrl: 'app/cully/partials/notification-list.htm',
                        controller: 'BizNotificationListCtrl'
                    })
                    .otherwise({
                        redirectTo: '/sign-in/'
                    });

                $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
                    return {
                        'responseError': function (rejection) {
                            if (405 === rejection.status) {
                                $location.path("/not-authenticated/").replace();
                            } else if (401 === rejection.status) {
                                $location.path("/session-out/");
                            }
                            return $q.reject(rejection);
                        }
                    };
                } ]);

            } ])
        .run(['$http', '$rootScope', '$location', 'authorizationType', 'authorization', 'currentUser',
            function ($http, $rootScope, $location, authorizationType, authorization, currentUser) {

                var routeChangeRequiredAfterLogin = false, loginRedirectUrl;
                $rootScope.$on('$routeChangeStart', function (event, next) {

                    var authorised;
                    if (routeChangeRequiredAfterLogin && next.originalPath !== "/sign-in/") {
                        routeChangeRequiredAfterLogin = false;
                        $location.path(loginRedirectUrl).replace();
                    } else if (next.access !== undefined) {
                        authorised = authorization.authorize(next.access.loginRequired,
                                                     next.access.roles);
                        if (authorised === authorizationType.loginRequired) {
                            routeChangeRequiredAfterLogin = true;
                            loginRedirectUrl = next.originalPath;
                            $location.path("/sign-in/");
                        } else if (authorised === authorizationType.notAuthorised) {
                            $location.path("/not-authorised/").replace();
                        }
                        var userToken = currentUser.getUsername();
                        if (userToken != undefined) {
                            $http.defaults.headers.common.Authorization = 'Basic ' + userToken + ' ' + currentUser.getSignature();
                        }
                    }

                });

            } ]);

    return {
        init: function () {
            angular.bootstrap(document, ['Cully']);
        }
    }

});