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

        } ]);

});