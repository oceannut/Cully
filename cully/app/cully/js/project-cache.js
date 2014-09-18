'use strict';

define(function (require) {

    require('ng');

    angular.module('project.cache', [])
        .constant('activityFace', 'activity')
        .constant('projectFace', 'project');

});
