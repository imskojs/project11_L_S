'use strict';
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  create: create,
  find: find,
  findOne: findOne,
  update: update,
  destroy: destroy,
};

function create(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Comment.create-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  if (!QueryService.checkParamPassed(query.content)) {
    return res.badRequest(400, { message: "!content" });
  }

  return Comment.create(query)
    .then((comment) => {
      return res.send(200, comment);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Comment.find-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let commentPromise = Comment.find(query);

  QueryService.applyPopulate(commentPromise, populate);

  let countPromise = Comment.count(query);

  return Promise.all([commentPromise, countPromise])
    .spread((comments, count) => {
      let more = (query.limit && comments[query.limit - 1]) ? true : false;
      if (more) {
        comments.splice(query.limit - 1, 1);
      }
      return res.ok({
        comments: comments,
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
  sails.log("queryWrapper --Comment.findOne-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  if (!QueryService.checkParamPassed(query.where.id)) {
    return res.send(400, { message: "!id" });
  }

  let commentPromise = Comment.find(query);

  QueryService.applyPopulate(commentPromise, populate);

  return commentPromise
    .then((comment) => {
      if (!comment) {
        return Promise.reject({ message: '!hasComment' });
      }
      return res.ok(comment);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


function update(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Comment.update-- :::\n", queryWrapper);

  let query = queryWrapper.query;
  let id = query.id;
  delete query.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.badRequest({ message: "!id" });
  }

  let propertiesAllowedToUpdate = ['content'];
  let propertiesToUpdate = {};
  _.forEach(propertiesAllowedToUpdate, (property) => {
    if (query[property]) {
      propertiesToUpdate[property] = query[property];
    }
  });

  return Comment.update({
      id: id
    }, propertiesToUpdate)
    .then(function(comments) {
      let comment = comments[0];
      return res.ok(comment);
    })
    .catch(function(err) {
      return res.negotiate(err);
    });
}

function destroy(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Comment.destory-- :::\n", queryWrapper);
  let id = queryWrapper.query.where.id;
  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }

  return Comment.destroy({
      id: id
    })
    .then(function(comments) {
      let comment = comments[0];
      return res.ok(comment);
    })
    .catch(function(err) {
      return res.negotiate(err);
    });
}
