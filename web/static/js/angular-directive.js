'use strict';

define(function (require) {

    angular.module('ng-directives', [])
        .directive('bspopover', function () {
            return function (scope, element, attrs) {
                scope.$watch('$viewContentLoaded', function () {
                    $(element).popover();
                });
            }
        })
        .directive('bshtmlpopover', function () {
            return function (scope, element, attrs) {
                // reference AngularJs学习笔记--directive  http://www.cnblogs.com/lcllao/archive/2012/09/09/2677190.html
                scope.$watch('$viewContentLoaded', function () {
                    var id = '#' + attrs.bshtmlpopover;
                    $(element).popover({
                        html: true,
                        content: function () {
                            return $(id).html();
                        }
                    });

                });
            }
        });

});