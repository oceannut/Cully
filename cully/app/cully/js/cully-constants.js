﻿'use strict';

define(function (require) {

    require('ng');

    angular.module('cully.constants', [])
        .constant('activityFace', 'activity')
        .constant('projectFace', 'project')
        .constant('logFace', 'log')
        .constant('attachmentFace', 'attachment');

});
