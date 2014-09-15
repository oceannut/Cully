'use strict';

define(function (require) {

    angular.module('utils', [])
        .factory('stringUtil', [function () {

            return {
                //reference: http://www.cnblogs.com/liszt/archive/2011/08/16/2140007.html
                removeHTML: function (str) {
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
        .factory('listUtil', [function () {

            return {
                add: function (list, item) {
                    if (list !== undefined && list !== null) {
                        if (list.indexOf(item) === -1) {
                            list.push(item);
                        }
                    }
                },
                remove: function (list, item) {
                    if (list !== undefined && list !== null) {
                        var i = list.indexOf(item);
                        if (i > -1) {
                            list.splice(i, 1);
                        }
                    }
                },
                shallowCopyList: function (target, srouce, append, predicate) {
                    target = target || [];
                    if (append === undefined || append === null || !append) {
                        target.length = 0;
                    }
                    if (srouce !== undefined && srouce !== null) {
                        for (var i = 0; i < srouce.length; i++) {
                            var item = srouce[i];
                            if (predicate === undefined || predicate === null || typeof (predicate) !== 'function' || predicate(item)) {
                                target.push(item);
                            }
                        }
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
                jsonToTicks: function (json) {
                    if (json) {
                        return json.substring(6, json.length - 7);
                    } else {
                        return null;
                    }
                },
                formatDateByYMD: function (date) {
                    var d = date.getDate();
                    var m = date.getMonth() + 1;
                    var y = date.getFullYear();
                    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
                },
                formatTimeByHMS: function (date) {
                    var h = date.getHours();
                    var m = date.getMinutes();
                    var s = date.getSeconds();
                    return '' + (h <= 9 ? '0' + h : h) + ':' + (m <= 9 ? '0' + m : m) + ':' + (s <= 9 ? '0' + s : s);
                },
                getDateDiff: function (startTime, endTime, diffType) {
                    //将计算间隔类性字符转换为小写
                    diffType = diffType.toLowerCase();
                    //作为除数的数字
                    var divNum = 1;
                    switch (diffType) {
                        case "second":
                            divNum = 1000;
                            break;
                        case "minute":
                            divNum = 1000 * 60;
                            break;
                        case "hour":
                            divNum = 1000 * 3600;
                            break;
                        case "day":
                            divNum = 1000 * 3600 * 24;
                            break;
                        default:
                            break;
                    }
                    return Math.ceil((endTime.getTime() - startTime.getTime()) / (divNum));
                },
                getDaysofMonth: function (month) {
                    switch (month) {
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            return 31;
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            return 30;
                        case 2:
                            var year = d.getFullYear();
                            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                                return 29;
                            } else {
                                return 28;
                            }
                        default:
                            throw 'unsupport';
                    }
                }

            }

        } ]);

});