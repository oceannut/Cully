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
                            faceModel: null,
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

                function _add(face, entity) {
                    var added = false;
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

                function setModel(faceId, model) {
                    var face = clear(faceId);
                    face.faceModel = model;
                }

                function getModel(faceId) {
                    var face = clear(faceId);
                    return face.faceModel;
                }

                function sync(faceId, source) {
                    var face = clear(faceId);
                    _.each(source, function (item) {
                        face.list.push(item);
                    });
                    $log.info(face.list.length + " objects of " + faceId + " cached");
                }

                function add(faceId, entity) {
                    var face = getFace(faceId);
                    if (_.isArray(entity)) {
                        var count = 0;
                        _.each(entity, function (item) {
                            if (_add(face, item)) {
                                count++;
                            }
                        });
                        return count;
                    } else {
                        return _add(face, entity);
                    }
                }

                function remove(faceId, id) {
                    var removed = false;
                    var face = getFace(faceId);
                    var list = face.list;
                    var len = list.length;
                    if (_.isFunction(id)) {
                        for (var i = 0; i < len; i++) {
                            if (id(list[i])) {
                                list.splice(i, 1);
                                removed = true;
                                break;
                            }
                        }
                    }
                    else if (_.isNumber(id)) {
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
                    var face = getFace(faceId);
                    if (_.isFunction(id)) {
                        return _.find(face.list, function (item) { return id(item); });
                    }
                    else if (_.isNumber(id)) {
                        return _.find(face.list, function (item) { return item.Id === id; });
                    } else {
                        return null;
                    }
                }

                function list(faceId) {
                    var face = getFace(faceId);
                    return face.list;
                }

                function info(faceId) {
                    var face = getFace(faceId);
                    $log.info(face.list);
                }

                return {
                    setModel: setModel,
                    getModel: getModel,
                    sync: sync,
                    add: add,
                    remove: remove,
                    get: get,
                    list: list,
                    info: info
                }

            } ]);

});
