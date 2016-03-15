/* jshint ignore:start */
'use strict';
const Promise = require('bluebird');
/* jshint ignore:end */
const _ = require('lodash');

module.exports = {
  find: find,
  findOne: findOne,
  createComment: createComment,
  updateComment: updateComment,
  destroyComment: destroyComment,
};


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

  let commentPromise = Comment.findOne(query);

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

function createComment(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Comment.createComment-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  if (!QueryService.checkParamPassed(query.content, query.category, query.post)) {
    return res.badRequest(400, { message: "!content||!category||!post" });
  }

  return Comment.create(query)
    .then((comment) => {
      let postPromise;
      if (comment.post) {
        postPromise = Post.findOne({
            id: comment.post
          })
          .populate('comments');
      }
      return [comment, postPromise];
    })
    .spread((comment, post) => {
      let commentCount;
      let postUpdate;
      if (post) {
        commentCount = post.comments.length;
        postUpdate = Post.update({
          id: post.id
        }, {
          commentCount: commentCount
        });

      }
      return [comment, postUpdate];
    })
    .spread((comment) => {
      return Comment.find({
        post: comment.post
      });
    })
    .then((comments) => {
      return res.ok({
        comments: comments
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


function updateComment(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Comment.update-- :::\n", queryWrapper);

  let query = queryWrapper.query;
  let id = query.id;
  delete query.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.badRequest({ message: "!id" });
  }

  let propertiesAllowedToUpdate = [
    'content', 'isAnnonymous', 'category', 'post', 'review', 'updatedBy'
  ];
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

function destroyComment(req, res) {
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
      let postPromise;
      if (comment.post) {
        postPromise = Post.findOne({
            id: comment.post
          })
          .populate('comments');
      }
      return [comment, postPromise];
    })
    .spread((comment, post) => {
      let commentCount;
      let postUpdate;
      if (post) {
        commentCount = post.comments.length;
        postUpdate = Post.update({
          id: post.id
        }, {
          commentCount: commentCount
        });
      }
      return [comment, postUpdate];
    })
    .spread((comment) => {
      return res.ok(comment);
    })
    .catch(function(err) {
      return res.negotiate(err);
    });
}
