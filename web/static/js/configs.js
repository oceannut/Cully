'use strict';

define(function (require) {

    angular.module('configs', [])
        .constant("wcfApp", "http://localhost:15453/web")
        .value('currentUser', { username: '' });

});