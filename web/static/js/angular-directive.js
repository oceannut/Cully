'use strict';

define(function (require) {

    angular.module('ng-directives', [])
        .directive('showpopover', function () {
            return function (scope, element, attrs) {
                // reference AngularJs学习笔记--directive  http://www.cnblogs.com/lcllao/archive/2012/09/09/2677190.html
                scope.$watch('$viewContentLoaded', function () {
                    var id = '#' + attrs.showpopover;
                    $(element).popover({
                        content: function () {
                            return $(id).html();
                        }
                    });

                });
            }
        });

});