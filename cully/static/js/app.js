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
    require('../../app/common/js/file-transfer-controllers');
    require('../../app/cully/js/client-controllers');
    require('../../app/cully/js/biz-notification-controllers');
    require('../../app/cully/js/index-controllers');
    require('../../app/cully/js/home-controllers');
    require('../../app/cully/js/project-controllers');
    require('../../app/cully/js/project-participant-controllers');
    require('../../app/cully/js/project-calendar-controllers');
    require('../../app/cully/js/project-log-controllers');
    require('../../app/cully/js/project-attachment-controllers');
    require('../../app/cully/js/activity-controllers');
    require('../../app/cully/js/task-controllers');
    require('../../app/cully/js/log-controllers');
    require('../../app/cully/js/calendar-controllers');

    angular.module('Cully', ['ngRoute',
            'LocalStorageModule',
            'auth.controllers',
            'category.controllers',
            'user.controllers',
            'notice.controllers',
            'idiom.controllers',
            'schedule.controllers',
            'fileTransfer.controllers',
            'client.controllers',
            'bizNotification.controllers',
            'index.controllers',
            'home.controllers',
            'project.controllers',
            'project.participant.controllers',
            'project.calendar.controllers',
            'project.log.controllers',
            'project.attachment.controllers',
            'activity.controllers',
            'task.controllers',
            'log.controllers',
            'calendar.controllers'
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
                    .when('/file-transfer-overview/', {
                        templateUrl: 'app/common/partials/file-transfer-overview.htm',
                        controller: 'FileTransferOverviewCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor', 'admin']
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
                    .when('/project-summary/:reload/', {
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
                    .when('/project-participant-list/:projectId/', {
                        templateUrl: 'app/cully/partials/project-participant-list.htm',
                        controller: 'ProjectParticipantListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['supvisor']
                        }
                    })
                    .when('/project-calendar-list/:projectId/', {
                        templateUrl: 'app/cully/partials/project-calendar-list.htm',
                        controller: 'ProjectCalendarListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/project-log-list/:projectId/:reload/', {
                        templateUrl: 'app/cully/partials/project-log-list.htm',
                        controller: 'ProjectLogListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/project-attachment-list/:projectId/', {
                        templateUrl: 'app/cully/partials/project-attachment-list.htm',
                        controller: 'ProjectAttachmentListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/project-attachment-details/:attachmentId/', {
                        templateUrl: 'app/cully/partials/project-attachment-details.htm',
                        controller: 'ProjectAttachmentDetailsCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
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
                    .when('/log-summary/:reload/', {
                        templateUrl: 'app/cully/partials/log-summary.htm',
                        controller: 'LogSummaryCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/log-add/:projectId/', {
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
                    .when('/calendar-summary/:day/', {
                        templateUrl: 'app/cully/partials/calendar-summary.htm',
                        controller: 'CalendarSummaryCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/calendar-list/', {
                        templateUrl: 'app/cully/partials/calendar-list.htm',
                        controller: 'CalendarListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/calendar-edit/:projectId/:id/', {
                        templateUrl: 'app/cully/partials/calendar-edit.htm',
                        controller: 'CalendarEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/clock-list/', {
                        templateUrl: 'app/cully/partials/clock-list.htm',
                        controller: 'ClockListCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
                        }
                    })
                    .when('/clock-edit/:id/', {
                        templateUrl: 'app/cully/partials/clock-edit.htm',
                        controller: 'ClockEditCtrl',
                        access: {
                            loginRequired: true,
                            roles: ['user', 'supvisor']
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