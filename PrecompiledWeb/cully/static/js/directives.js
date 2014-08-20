'use strict';

define(function (require) {

    angular.module('directives', [])
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
        })
        .directive('checkcode', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var selectChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');

                    var createCode = function () {
                        var code = "";
                        for (var i = 0; i < 6; i++) {
                            var charIndex = Math.floor(Math.random() * 36);
                            code += selectChar[charIndex];
                        }
                        scope.checkcode = code;
                        $(element).html(code);
                    };

                    createCode();
                    scope.$on('refreshCheckCode', function (e) {
                        createCode()
                    });

                }
            }
        });

});