//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
const Promise = require('bluebird');
/* jshint ignore:end */
const _ = require('lodash');

module.exports = {
  createPlace: createPlace,
  destroy: destroy,

  //====================================================
  //  Not used
  //====================================================
  find: find,
  create: create,
};


// place, owner
function createPlace(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Favorite.createPlace-- :::\n", queryWrapper);
  let query = queryWrapper.query;

  if (!QueryService.checkParamPassed(query.place)) {
    return res.badRequest({ message: '!place' });
  }

  return Favorite.find({
      place: query.place,
      owner: req.user && req.user.id
    })
    .then((favorites) => {
      if (favorites.length !== 0) {
        return Promise.reject({ message: 'isAlreadyFavorite' });
      }
      return Favorite.create(query);
    })
    .then((favorite) => {
      let favoriteCount = Favorite.count({
        place: favorite.place,
      });

      let favoriteFind = Favorite.find({
        owner: req.user && req.user.id
      });

      return [favoriteCount, favoriteFind];
    })
    .spread((favoriteCount, favorites) => {
      let placeUpdate = Place.update({
        id: query.place
      }, {
        favoriteCount: favoriteCount
      });

      return [favorites, placeUpdate];
    })
    .spread((favorites) => {
      let favoritePlaces = _.pluck(favorites, 'place');
      return res.ok({
        favorites: favoritePlaces
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


// Associations to Delete
// photos, comments
function destroy(req, res) {
  var query = req.allParams();
  // var queryWrapper = QueryService.buildQuery(req);
  // sails.log("queryWrapper --Favorite.destroy-- :::\n", queryWrapper);
  // var query = queryWrapper.query;

  if (!QueryService.checkParamPassed(query.place, req.user)) {
    return res.send(400, { message: "!place || !loggedIn" });
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
      let favoritePlaces = _.pluck(favorites, 'place');
      return res.ok({
        favorites: favoritePlaces,
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

//====================================================
//  Not used
//====================================================
function create(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Favorite.create-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  return Favorite.create(query)
    .then((favorite) => {
      return Favorite.findOne({
        where: {
          id: favorite.id
        }
      });
    })
    .then((favorite) => {
      return res.ok(favorite);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Favorite.find-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  if (!QueryService.checkParamPassed(query.where.owner)) {
    return res.badRequest({ message: '!owner' });
  }

  let favoriteFind = Favorite.find(query);
  _.forEach(populate, (populateProp) => {
    if (typeof populateProp === 'string') {
      favoriteFind = favoriteFind.populate(populateProp);
    } else {
      favoriteFind = favoriteFind.populate(populateProp.property, populateProp.criteria);
    }
  });

  let countPromise = Favorite.count(query);

  return Promise.all([favoriteFind, countPromise])
    .spread((favorites, count) => {
      return res.ok({
        favorites: favorites,
        total: count
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}