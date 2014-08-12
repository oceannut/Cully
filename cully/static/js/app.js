'use strict';

define(function (require) {

    require('ng-route');

    require('../../app/auth/js/auth-controllers');
    require('../../app/common/js/user-controllers');
    require('../../app/cully/js/index-controllers');
    require('../../app/cully/js/project-controllers');
    require('../../app/cully/js/activity-controllers');

    angular.module('Cully', ['ngRoute',
            'auth.controllers',
            'user.controllers',
            'index.controllers',
            'project.controllers',
            'activity.controllers'
        ])
        .config(['$routeProvider', '$httpProvider',
            function ($routeProvider, $httpProvider) {

                $routeProvider.
                    when('/sign-in/', {
                        templateUrl: 'app/auth/partials/sign-in.htm',
                        controller: 'SignInCtrl'
                    }).
                    when('/sign-up/', {
                        templateUrl: 'app/auth/partials/sign-up.htm',
                        controller: 'SignUpCtrl'
                    }).
                    when('/sign-out/', {
                        templateUrl: 'app/auth/partials/sign-out.htm',
                        controller: 'SignOutCtrl'
                    }).
                    when('/not-authorised/', {
                        templateUrl: 'app/auth/partials/not-authorised.htm'
                    }).
                    when('/not-authenticated/', {
                        templateUrl: 'app/auth/partials/not-authenticated.htm',
                        controller: 'NotAuthenticatedCtrl'
                    }).
                    when('/session-out/', {
                        templateUrl: 'app/auth/partials/session-out.htm',
                        controller: 'SessionOutCtrl'
                    }).
                    when('/user-setting/:username/', {
                        templateUrl: 'app/common/partials/user-setting.htm',
                        controller: 'UserSettingCtrl',
                        access: {
                            loginRequired: true
                        }
                    }).
                    when('/home/', {
                        templateUrl: 'app/cully/partials/home.htm',
                        access: {
                            loginRequired: true
                        }
                    }).
                    when('/project-summary/', {
                        templateUrl: 'app/cully/partials/project-summary.htm',
                        access: {
                            loginRequired: true
                        }
                    }).
                    when('/log-summary/', {
                        templateUrl: 'app/cully/partials/log-summary.htm',
                        access: {
                            loginRequired: true
                        }
                    }).
                    otherwise({
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