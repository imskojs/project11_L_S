//====================================================
//  Touched by Ko
//====================================================
'use strict';
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  create: create,
  find: find,
  findOne: findOne,
  update: update,
  destroy: destroy
};

function create(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Event.create-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  if (!QueryService.checkParamPassed(query.category)) {
    return res.send(400, { message: "!category" });
  }

  return Event.create(query)
    .then((event) => {
      let eventPromise = Event.findOne({ id: event.id });
      QueryService.applyPopulate(eventPromise, populate);
      return eventPromise;
    })
    .then((event) => {
      return res.ok(event);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Event.find--:::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let eventPromise = Event.find(query);
  QueryService.applyPopulate(eventPromise, populate);
  let countPromise = Event.count(query);

  return Promise.all([eventPromise, countPromise])
    .spread((events, count) => {
      let more = (events[query.limit - 1]) ? true : false;
      if (more) {
        events.pop();
      }
      return res.ok({
        events: events,
        more: more,
        total: count
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function findOne(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Event.findOne-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let eventPromise = Event.findOne(query);
  QueryService.applyPopulate(eventPromise, populate);

  return eventPromise
    .then((event) => {
      return res.ok(event);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function update(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Event.update-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  query.updatedBy = req.user && req.user.id;
  let id = query.id;
  delete query.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }

  let propertiesAllowedToUpdate = [
    'photos', 'title', 'category', 'showLinkButton', 'duration', 'location', 'content',
    'warning'
  ];
  let propertiesToUpdate = {};
  _.forEach(propertiesAllowedToUpdate, (property) => {
    if (query[property]) {
      propertiesToUpdate[property] = query[property];
    }
  });

  return Event.update({
      id: id
    }, propertiesToUpdate)
    .then((events) => {
      let event = events[0];
      return res.ok(event);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function destroy(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Event.destroy-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let id = query.where.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }

  return Event.destroy({
      id: id
    })
    .then((events) => {
      let event = events[0];
      let photoDestroy = Photo.destroy({ event: event.id });
      return [event, photoDestroy];
    })
    .spread((event, photos) => {
      event.photos = photos;
      return res.ok(event);

    })
    .catch((err) => {
      return res.negotiate(err);
    });
}
