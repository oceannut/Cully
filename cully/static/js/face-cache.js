'use strict';

define(function (require) {

    require('ng');
    require('underscore');

    angular.module('face.cache', [])
        .factory('faceCache', ['$log',
            function ($log) {

                var faces = [];

                function getFace(faceId) {
                    var face = _.find(faces, function (item) { return item.id === faceId; });
                    if (face === undefined || face === null) {
                        face = {
                            id: faceId,
                            list: []
                        }
                        faces.push(face);
                    }
                    return face;
                }

                function clear(faceId) {
                    var face = getFace(faceId);
                    face.list.length = 0;
                    return face;
                }

                function sync(faceId, source) {
                    var face = clear(faceId);
                    _.each(source, function (item) {
                        face.list.push(item);
                    });
                    $log.info(face.list.length + " objects of " + faceId + " cached");
                }

                function add(faceId, entity) {
                    var added = false;
                    var face = getFace(faceId);
                    var list = face.list;
                    if (entity !== undefined
                            && entity !== null
                            && _.isNumber(entity.Id)
                            && !_.some(list, function (item) { return item.Id === entity.Id; })) {
                        list.push(entity);
                        added = true;
                    }
                    return added;
                }

                function remove(faceId, id) {
                    var removed = false;
                    if (_.isNumber(id)) {
                        var face = getFace(faceId);
                        var list = face.list;
                        var len = list.length;
                        for (var i = 0; i < len; i++) {
                            if (list[i].Id === id) {
                                list.splice(i, 1);
                                removed = true;
                                break;
                            }
                        }
                    }
                    return removed;
                }

                function get(faceId, id) {
                    if (!_.isNumber(id)) {
                        return null;
                    }
                    var face = getFace(faceId);
                    return _.find(face.list, function (item) { return item.Id === id; });
                }

                function info(faceId) {
                    var face = getFace(faceId);
                    $log.info(face.list);
                }

                return {
                    sync: sync,
                    add: add,
                    remove: remove,
                    get: get,
                    info: info
                }

            } ]);

});
