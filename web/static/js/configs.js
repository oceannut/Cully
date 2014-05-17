'use strict';

define(function (require) {

    angular.module('configs', [])
        .constant("wcfApp", "http://localhost:6152/web")
        .value('currentUser', { username: '' });

});