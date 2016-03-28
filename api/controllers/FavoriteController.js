/* globals Favorite */
/* globals QueryService */
//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
const Promise = require('bluebird');
/* jshint ignore:end */
const _ = require('lodash');

module.exports = {
  destroy: destroy,
  create: create,
  //====================================================
  //  Not used
  //====================================================
  // createPlace: createPlace,
  // find: find,
};

// photos, comments
function destroy(req, res) {
  var query = req.allParams();
  // var queryWrapper = QueryService.buildQuery(req);
  // sails.log("queryWrapper --Favorite.destroy-- :::\n", queryWrapper);
  // var query = queryWrapper.query;

  if (!QueryService.checkParamPassed(query.post, req.user)) {
    return res.send(400, { message: "!post || !loggedIn" });
  }

  if (!query.owner) {
    query.owner = req.user && req.user.id;
  }

  return Favorite.destroy(query)
    .then(() => {
      let favoriteFind = Favorite.find({
        owner: req.user && req.user.id
      });
      return favoriteFind;
    })
    .then((favorites) => {
      let favoritePosts = _.pluck(favorites, 'post');
      return res.ok({
        favorites: favoritePosts,
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function create(req, res) {
  let query = req.allParams();
  sails.log("queryWrapper --Favorite.create-- :::\n", query);
  if (!query.owner) {
    query.owner = req.user && req.user.id;
  }
  return Favorite.create(query)
    .then(() => {
      return Favorite.find({
        where: {
          owner: req.user && req.user.id
        }
      });
    })
    .then((preFavs) => {
      var favs = _.pluck(preFavs, 'post');
      return res.ok({
        favorites: favs
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

//====================================================
//  Not used
//====================================================

// function find(req, res) {
//   let queryWrapper = QueryService.buildQuery(req);
//   sails.log("queryWrapper --Favorite.find-- :::\n", queryWrapper);
//   let query = queryWrapper.query;
//   let populate = queryWrapper.populate;

//   if (!QueryService.checkParamPassed(query.where.owner)) {
//     return res.badRequest({ message: '!owner' });
//   }

//   let favoriteFind = Favorite.find(query);
//   _.forEach(populate, (populateProp) => {
//     if (typeof populateProp === 'string') {
//       favoriteFind = favoriteFind.populate(populateProp);
//     } else {
//       favoriteFind = favoriteFind.populate(populateProp.property, populateProp.criteria);
//     }
//   });

//   let countPromise = Favorite.count(query);

//   return Promise.all([favoriteFind, countPromise])
//     .spread((favorites, count) => {
//       return res.ok({
//         favorites: favorites,
//         total: count
//       });
//     })
//     .catch((err) => {
//       return res.negotiate(err);
//     });
// }
// // place, owner
// function createPlace(req, res) {
//   let queryWrapper = QueryService.buildQuery(req);
//   sails.log("queryWrapper --Favorite.createPlace-- :::\n", queryWrapper);
//   let query = queryWrapper.query;

//   if (!QueryService.checkParamPassed(query.place)) {
//     return res.badRequest({ message: '!place' });
//   }

//   return Favorite.find({
//       place: query.place,
//       owner: req.user && req.user.id
//     })
//     .then((favorites) => {
//       if (favorites.length !== 0) {
//         return Promise.reject({ message: 'isAlreadyFavorite' });
//       }
//       return Favorite.create(query);
//     })
//     .then((favorite) => {
//       let favoriteCount = Favorite.count({
//         place: favorite.place,
//       });

//       let favoriteFind = Favorite.find({
//         owner: req.user && req.user.id
//       });

//       return [favoriteCount, favoriteFind];
//     })
//     .spread((favoriteCount, favorites) => {
//       let placeUpdate = Place.update({
//         id: query.place
//       }, {
//         favoriteCount: favoriteCount
//       });

//       return [favorites, placeUpdate];
//     })
//     .spread((favorites) => {
//       let favoritePlaces = _.pluck(favorites, 'place');
//       return res.ok({
//         favorites: favoritePlaces
//       });
//     })
//     .catch((err) => {
//       return res.negotiate(err);
//     });
// }
