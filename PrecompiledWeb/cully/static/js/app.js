'use strict';

define(function (require) {

    require('ng-route');
    require('ng-local-storage');

    require('../../app/auth/js/auth-controllers');
    require('../../app/common/js/category-controllers');
    require('../../app/common/js/user-controllers');
    require('../../app/common/js/notice-controllers');
    require('../../app/common/js/idiom-controllers');
    require('../../app/common/js/schedule-controllers');
    require('../../app/cully/js/client-controllers');
    require('../../app/cully/js/biz-notification-controllers');
    require('../../app/cully/js/index-controllers');
    require('../../app/cully/js/home-controllers');
    require('../../app/cully/js/project-controllers');
    require('../../app/cully/js/activity-controllers');
    require('../../app/cully/js/task-controllers');
    require('../../app/cully/js/participant-controllers');
    require('../../app/cully/js/log-controllers');

    angular.module('Cully', ['ngRoute',
            'LocalStorageModule',
            'auth.controllers',
            'category.controllers',
            'user.controllers',
            'notice.controllers',
            'idiom.controllers',
            'schedule.controllers',
            'client.controllers',
            'bizNotification.controllers',
            'index.controllers',
            'home.controllers',
            'project.controllers',
            'activity.controllers',
            'task.controllers',
            'participant.controllers',
            'log.controllers'
        ])
        .config(['$routeProvider', '$httpProvider', 'localStorageServiceProvider',
            function ($routeProvider, $httpProvider, localStorageServiceProvider) {

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
                    .when('/password-modify/:username/', {
                        templateUrl: 'app/auth/partials/password-modify.htm',
                        controller: 'PasswordModifyCtrl',
                        access: {
                            loginRequired: true
                        }
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
                    .when('/category-overview/', {
                        templateUrl: 'app/common/partials/category-overview.htm',
                        controller: 'CategoryOverviewCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin']
                        }
                    })
                    .when('/category-list/:scope/', {
                        templateUrl: 'app/common/partials/category-list.htm',
                        controller: 'CategoryListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin']
                        }
                    })
                    .when('/category-edit/:scope/:id/', {
                        templateUrl: 'app/common/partials/category-edit.htm',
                        controller: 'CategoryEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin']
                        }
                    })
                    .when('/user-role-overview/:which/', {
                        templateUrl: 'app/common/partials/user-role-overview.htm',
                        controller: 'UserRoleOverviewCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin']
                        }
                    })
                    .when('/user-role-assign/:username/', {
                        templateUrl: 'app/common/partials/user-role-assign.htm',
                        controller: 'UserRoleAssignCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin']
                        }
                    })
                    .when('/role-user-assign/:role/', {
                        templateUrl: 'app/common/partials/role-user-assign.htm',
                        controller: 'RoleUserAssignCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin']
                        }
                    })
                    .when('/user-setting/:username/', {
                        templateUrl: 'app/common/partials/user-setting.htm',
                        controller: 'UserSettingCtrl',
                        access: {
                            loginRequired: true
                        }
                    })
                    .when('/notice-list/', {
                        templateUrl: 'app/common/partials/notice-list.htm',
                        controller: 'NoticeListCtrl',
                        access: {
                            loginRequired: true
                        }
                    })
                    .when('/notice-edit/:id/', {
                        templateUrl: 'app/common/partials/notice-edit.htm',
                        controller: 'NoticeEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin', 'supvisor']
                        }
                    })
                    .when('/notice-details/:id/', {
                        templateUrl: 'app/common/partials/notice-details.htm',
                        controller: 'NoticeDetailsCtrl',
                        access: {
                            loginRequired: true
                        }
                    })
                    .when('/idiom-overview/', {
                        templateUrl: 'app/common/partials/idiom-overview.htm',
                        controller: 'IdiomOverviewCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin', 'supvisor']
                        }
                    })
                    .when('/idiom-list/:scope/', {
                        templateUrl: 'app/common/partials/idiom-list.htm',
                        controller: 'IdiomListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin', 'supvisor']
                        }
                    })
                    .when('/idiom-edit/:scope/:id/', {
                        templateUrl: 'app/common/partials/idiom-edit.htm',
                        controller: 'IdiomEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin', 'supvisor']
                        }
                    })
                    .when('/schedule-list/', {
                        templateUrl: 'app/common/partials/schedule-list.htm',
                        controller: 'ScheduleListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['admin']
                        }
                    })
                    .when('/client-setting/:username/', {
                        templateUrl: 'app/cully/partials/client-setting.htm',
                        controller: 'ClientSettingCtrl',
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
                    .when('/participant-list/:projectId/', {
                        templateUrl: 'app/cully/partials/participant-list.htm',
                        controller: 'ParticipantListCtrl',
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
                    .when('/activity-task-delay/:id/', {
                        templateUrl: 'app/cully/partials/activity-task-delay.htm',
                        controller: 'ActivityTaskDelayCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
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
                    .when('/log-summary/', {
                        templateUrl: 'app/cully/partials/log-summary.htm',
                        controller: 'LogSummaryCtrl',
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
                    .when('/notification-list/:box/', {
                        templateUrl: 'app/cully/partials/notification-list.htm',
                        controller: 'BizNotificationListCtrl',
                        access: {
                            loginRequired: true
                        }
                    })
                    .when('/untreated-notification/', {
                        templateUrl: 'app/cully/partials/untreated-notification.htm',
                        controller: 'UntreatedBizNotificationCtrl',
                        access: {
                            loginRequired: true
                        }
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

                localStorageServiceProvider.setPrefix('cully');
                localStorageServiceProvider.setStorageCookieDomain('thinkinbio.com');

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