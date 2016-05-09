//====================================================
//  Touched by SKo 4.11
//====================================================
/* globals QueryService */
/* globals Post, User, Favorite */

/* jshint ignore:start */
'use strict';
const Promise = require('bluebird');
/* jshint ignore:end */
const _ = require('lodash');

module.exports = {
  findOne: findOne,
  find: find,
  findFavorite: findFavorite,
  create: create,
  destroyCreate: destroyCreate,
  update: update,
  destroy: destroy
};

function findOne(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Post.findOne-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let postPromise = Post.findOne(query);
  QueryService.applyPopulate(postPromise, populate);

  return postPromise
    .then((post) => {
      if(!post){
        
      }
      let owner;
      if (typeof post.owner === 'string') {
        owner = post.owner;
      } else {
        owner = post.owner && post.owner.id;
      }
      let userPromise = User.findOne({
          id: owner
        })
        .populate('profilePhoto')
        .populate('photos');

      return [post, userPromise];
    })
    .spread((post, user) => {
      let pojoPost = post.toObject();
      pojoPost.owner = user;
      return res.ok(pojoPost);
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
      return [posts, more, count];
    })
    .spread((posts, more, count) => {
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

function findFavorite(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Post.find--:::\n", queryWrapper);
  // let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  if (!QueryService.checkParamPassed(req.user)) {
    return res.send(400, { message: "loggedIn" });
  }

  return Favorite.find({
      owner: req.user.id
    })
    .then(function(preFavorites) {
      var favorites = _.pluck(preFavorites, 'place');
      var postsPro = Post.find({ id: favorites });
      QueryService.applyPopulate(postsPro, populate);
      return [favorites, postsPro];
    })
    .spread(function(favorites, posts) {
      return res.ok({
        favorites: favorites,
        posts: posts
      });
    })
    .catch(function(err) {
      return res.negotiate(err);
    });
}

function destroyCreate(req, res) {
  let query = req.allParams();
  console.log("query :::\n", query);
  if (!QueryService.checkParamPassed(req.user, query.category)) {
    return res.send(400, { message: "!loggedIn || !category" });
  }
  return Post.destroy({
      owner: req.user && req.user.id,
      category: query.category
    })
    .then(function(posts) {
      let pro1 = Favorite.destroy({ post: posts });
      let pro2 = Post.create(query);
      return [pro1, pro2];
    })
    .spread(function(fav, post) {
      return res.ok(post);
    })
    .catch(function(err) {
      return res.negotiate(err);
    });
}

function create(req, res) {
  let query = req.allParams();

  if (!QueryService.checkParamPassed(query.category)) {
    return res.send(400, { message: "!category" });
  }
  return Post.create(query)
    .then((post) => {
      return res.ok(post);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function update(req, res) {
  let query = req.allParams();
  let id = query.id;
  delete query.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }

  return Post.update({
      id: id
    }, query)
    .then((posts) => {
      return res.ok({ posts: posts });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function destroy(req, res) {
  let query = req.allParams();
  let id = query.id;
  sails.log("query :::\n", query);
  // let queryWrapper = QueryService.buildQuery(req);
  // sails.log("queryWrapper --Post.destroy-- :::\n", queryWrapper);
  // let query = queryWrapper.query;
  // let id = query.where.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }
  return Post.destroy({
      id: id
    })
    .then((posts) => {
      let post = posts[0];
      let favs = Favorite.destroy({ post: post.id });
      return [favs, post];
    })
    .spread((favs, dPost) => {
      return res.ok(dPost);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


// function find(req, res) {
//   let queryWrapper = QueryService.buildQuery(req);
//   sails.log("queryWrapper --Post.find--:::\n", queryWrapper);
//   let query = queryWrapper.query;
//   let populate = queryWrapper.populate;

//   let postPromise = Post.find(query);
//   QueryService.applyPopulate(postPromise, populate);
//   let countPromise = Post.count(query);

//   return Promise.all([postPromise, countPromise])
//     .spread((posts, count) => {
//       let more = (posts[query.limit - 1]) ? true : false;
//       if (more) {
//         posts.pop();
//       }
//       let usersPromise = _.map(posts, (post) => {
//         let owner;
//         if (typeof post.owner === 'string') {
//           owner = post.owner;
//         } else {
//           owner = post.owner && post.owner.id;
//         }
//         return User.findOne({
//             id: owner
//           })
//           .populate('profilePhoto');
//       });
//       return [posts, Promise.all(usersPromise), more, count];
//     })
//     .spread((posts, users, more, count) => {
//       let pojoPosts = _.map(posts, (post, i) => {
//         var pojoPost = post.toObject();
//         pojoPost.owner = users[i];
//         return pojoPost;
//       });
//       return res.ok({
//         posts: pojoPosts,
//         more: more,
//         total: count
//       });

//     })
//     .catch((err) => {
//       return res.negotiate(err);
//     });
// }
