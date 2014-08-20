'use strict';

define(function (require) {

    require('ng');

    angular.module('common.utils', [])
        .factory('CategoryHelper', function () {
            return {
                selectCategory: function (list, code, func) {
                    if (list !== undefined && list !== null && code !== undefined && code !== null) {
                        for (var i = 0; i < list.length; i++) {
                            var item = list[i];
                            if (item.Code === code) {
                                item.active = "active";
                                (func || angular.noop)(item);
                            } else {
                                item.active = "";
                            }
                        }
                    }
                }
            }
        });

});