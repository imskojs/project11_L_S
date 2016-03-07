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
  sails.log("queryWrapper --Post.create-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  if (!QueryService.checkParamPassed(query.category, query.content)) {
    return res.send(400, { message: "!category || !content" });
  }

  return Post.create(query)
    .then((post) => {
      let postPromise = Post.findOne({ id: post.id });
      QueryService.applyPopulate(postPromise, populate);
      return postPromise;
    })
    .then((post) => {
      return res.ok(post);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Post.find--:::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let postPromise = Post.find(query);
  QueryService.applyPopulate(postPromise, populate);
  let countPromise = Post.count(query);

  return Promise.all([postPromise, countPromise])
    .spread((posts, count) => {
      let more = (posts[query.limit - 1]) ? true : false;
      if (more) {
        posts.pop();
      }
      return res.ok({
        posts: posts,
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
  sails.log("queryWrapper --Post.findOne-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let postPromise = Post.findOne(query);
  QueryService.applyPopulate(postPromise, populate);

  return postPromise
    .then((post) => {
      return res.ok(post);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function update(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Post.update-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  query.updatedBy = req.user && req.user.id;
  let id = query.id;
  delete query.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, {
      message: "no id sent"
    });
  }

  let propertiesAllowedToUpdate = [
    'title', 'category', 'showInTalk', 'content', 'photos'
  ];
  let propertiesToUpdate = {};
  _.forEach(propertiesAllowedToUpdate, (property) => {
    if (query[property]) {
      propertiesToUpdate[property] = query[property];
    }
  });

  return Post.update({
      id: id
    }, propertiesToUpdate)
    .then((posts) => {
      let post = posts[0];
      return res.ok(post);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function destroy(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Post.destroy-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let id = query.where.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }
  return Post.destroy({
      id: id
    })
    .then((posts) => {
      let post = posts[0];
      let comments = Comment.destroy({ post: post.id });
      return [post, comments];
    })
    .spread((dPost) => {
      return res.ok(dPost);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}
