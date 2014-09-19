'use strict';

define(function (require) {

    require('ng');
    require('ng-local-storage');

    angular.module('client.services', ['LocalStorageModule'])
        .factory("localStorageUtil", ['localStorageService', function (localStorageService) {

            function get(username, key) {
                return localStorageService.get(username + '.' + key);
            }

            return {
                animation: 'animation',
                animationDV: false,
                pageSize: 'pageSize',
                pageSizeDV: 10,
                caution: 'caution',
                cautionDV: 60,
                cautionByMusic: 'cautionByMusic',
                cautionByMusicDV: 'true',
                caution4Task: 'caution4Task',
                caution4TaskDV: 'false',
                getUserData: function (username, key, defaultValue, needEval) {
                    var value = get(username, key);
                    if (value == null && defaultValue != undefined) {
                        value = defaultValue;
                    }
                    if (value != null && needEval) {
                        value = eval('(' + value + ')');
                    }
                    return value;
                },
                setUserData: function (username, key, value) {
                    localStorageService.set(username + '.' + key, value);
                },
                loadUserData: function (username, key, defaultValue, needEval, callback) {
                    var value = get(username, key);
                    if (value !== null) {
                        if (needEval) {
                            value = eval('(' + value + ')');
                        }
                        (callback || angular.noop)(key, value);
                    } else {
                        (callback || angular.noop)(key, defaultValue);
                    }
                }
            }

        } ]);

});