'use strict';

define(function (require) {

    angular.module('utils', [])
        .factory('urlUtil', [function () {

            return {
                //reference: http://www.jquery4u.com/snippets/url-parameters-jquery/
                getUrlParam: function (name) {
                    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
                    if (results == null) {
                        return null;
                    }
                    else {
                        return results[1] || 0;
                    }
                }
            }

        } ])
        .factory('dateUtil', [function () {

            return {
                getDate: function (date) {
                    var now = new Date();
                    if (date == '0') {
                        //today
                    } else if (date == '-1') {
                        //yestoday
                        now.setDate(now.getDate() - 1);
                    } else if (date == '7') {
                        //this week
                        now.setDate(now.getDate() - now.getDay() + 1);
                    } else if (date == '-7') {
                        //last week
                        now.setDate(now.getDate() - now.getDay() - 6);
                    }
                    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                },
                getSpan: function (date) {
                    if (date == '0') {
                        //today
                        return '1';
                    } else if (date == '-1') {
                        //yestoday
                        return '1';
                    } else if (date == '7') {
                        //this week
                        return new Date().getDay().toString();
                    } else if (date == '-7') {
                        //last week
                        return '7';
                    }
                    return '0';
                }
            }

        } ]);

});