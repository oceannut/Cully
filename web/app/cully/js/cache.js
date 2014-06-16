'use strict';

define(function (require) {

    angular.module('cache', [])
        .value('userCache', { 'userList': [] });

});