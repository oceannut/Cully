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

                function _add(face, entity, first) {
                    var added = false;
                    var list = face.list;
                    if (entity !== undefined
                            && entity !== null
                            && _.isNumber(entity.Id)
                            && !_.some(list, function (item) { return item.Id === entity.Id; })) {
                        if (first) {
                            list.unshift(entity);
                        } else {
                            list.push(entity);
                        }
                        added = true;
                    }
                    return added;
                }

                function setModel(faceId, model) {
                    var face = getFace(faceId);
                    face.faceModel = model;
                }

                function getModel(faceId) {
                    var face = getFace(faceId);
                    return face.faceModel;
                }

                function add(faceId, entity) {
                    var face = getFace(faceId);
                    if (_.isArray(entity)) {
                        var count = 0;
                        _.each(entity, function (item) {
                            if (_add(face, item, false)) {
                                count++;
                            }
                        });
                        return count;
                    } else {
                        return _add(face, entity, false);
                    }
                }

                function insertFirst(faceId, entity) {
                    var face = getFace(faceId);
                    return _add(face, entity, true);
                }

                function replace(faceId, entity) {
                    var update = false;
                    var face = getFace(faceId);
                    if (entity !== undefined
                            && entity !== null
                            && _.isNumber(entity.Id)) {
                        var list = face.list;
                        var len = list.length;
                        for (var i = 0; i < len; i++) {
                            if (list[i].Id === entity.Id) {
                                list[i] = entity;
                                update = true;
                                break;
                            }
                        }
                        if (!update) {
                            list.unshift(entity);
                        }
                    }
                    return update;
                }

                function remove(faceId, id) {
                    var removed;
                    var face = getFace(faceId);
                    var list = face.list;
                    if (_.isFunction(id)) {
                        removed = 0;
                        for (var i = 0; i < list.length; i++) {
                            if (id(list[i])) {
                                list.splice(i, 1);
                                removed++;
                                i--;
                            }
                        }
                    }
                    else if (_.isNumber(id)) {
                        removed = false;
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

                function query(faceId, predicate) {
                    var face = getFace(faceId);
                    if (!_.isFunction(predicate)) {
                        $log.warning("The predicate shoud be the function");
                        return [];
                    }
                    return _.filter(face.list, function (item) {
                        return predicate(item);
                    });
                }

                function init(faceId, source) {
                    var face = clear(faceId);
                    _.each(source, function (item) {
                        face.list.push(item);
                    });
                    $log.info(face.list.length + " objects of " + faceId + " cached");
                }

                function pull(faceId, target) {
                    var face = getFace(faceId);
                    if (!_.isArray(target)) {
                        target = [];
                    }
                    _.each(face.list, function (item) {
                        target.push(item);
                    });
                    return target;
                }

                function info(faceId) {
                    var face = getFace(faceId);
                    $log.info(face.list);
                }

                return {
                    setModel: setModel,
                    getModel: getModel,
                    add: add,
                    insertFirst: insertFirst,
                    replace: replace,
                    remove: remove,
                    get: get,
                    query: query,
                    init: init,
                    pull: pull,
                    info: info
                }

            } ]);

});
