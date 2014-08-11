'use strict';

define(function (require) {

    angular.module('filters', [])
        .filter("jsonDateFormat", [function () {
            //var re = /\\\/Date\(([0-9]*)\)\\\//;
            return function (json) {
                //            var m = json.match(re);
                //            if (m) return new Date(parseInt(m[1]));
                //            else return null;
                if (json) {
                    return eval("new " + json.replace(/\\|\//g, ''));
                } else {
                    return null;
                }
            };
        } ]);

});