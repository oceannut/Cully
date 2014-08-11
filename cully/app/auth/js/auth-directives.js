'use strict';

define(function (require) {

    require('./auth-models');

    angular.module('auth-directives', [])
        .directive('access', ['authorizationType', 'authorization', function (authorizationType, authorization) {
            return function (scope, element, attrs) {

                // reference https://github.com/jonsamwell/blog_examples/blob/master/angular-route-authorisation/js/modules/auth/directives/access.js
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var makeVisible = function () {
                            element.removeClass('hidden');
                        },
                        makeHidden = function () {
                            element.addClass('hidden');
                        },
                        determineVisibility = function (resetFirst) {
                            var result;
                            if (resetFirst) {
                                makeVisible();
                            }

                            result = authorization.authorize(true, roles);
                            if (result === authorizationType.authorised) {
                                makeVisible();
                            } else {
                                makeHidden();
                            }
                        },
                        roles = attrs.access.split(',');

                        if (roles.length > 0) {
                            determineVisibility(true);
                        }

                    }
                };
            }

        } ]);

});