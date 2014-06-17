'use strict';

define(function (require) {

    angular.module('utils', [])
        .factory('stringUtil', [function () {

            return {
                //reference: http://www.cnblogs.com/liszt/archive/2011/08/16/2140007.html
                removeHTML: function(str) {
                    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
                    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
                    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
                    str = str.replace(/&nbsp;|&#10;/ig, ''); //去掉&nbsp;
                    return str;
                }
            }

        } ])
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
                    var day = now.getDay();
                    if (date == '0') {
                        //today
                    } else if (date == '-1') {
                        //yestoday
                        now.setDate(now.getDate() - 1);
                    } else if (date == '7') {
                        //this week
                        if (day == 0) {
                            now.setDate(now.getDate() - 6);
                        } else {
                            now.setDate(now.getDate() - day + 1);
                        }
                    } else if (date == '-7') {
                        //last week
                        if (day == 0) {
                            now.setDate(now.getDate() - 7 - 6);
                        } else {
                            now.setDate(now.getDate() - now.getDay() - 6);
                        }
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
                        var day = new Date().getDay();
                        if (day == 0) {
                            return '7';
                        } else {
                            return day.toString();
                        }
                    } else if (date == '-7') {
                        //last week
                        return '7';
                    }
                    return '0';
                },
                jsonToDate: function (json) {
                    if (json) {
                        return eval("new " + json.replace(/\\|\//g, ''));
                    } else {
                        return null;
                    }
                },
                formatDateByYMD: function (date) {
                    var d = date.getDate();
                    var m = date.getMonth() + 1;
                    var y = date.getFullYear();
                    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
                }
            }

        } ]);

});