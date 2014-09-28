'use strict';

define(function (require) {

    angular.module('configs', [])
        .constant("appName", "Cully")
        .constant("wcfApp", "http://localhost:6059/cully")
        .constant("fileApp", "http://localhost/fileServer");

});