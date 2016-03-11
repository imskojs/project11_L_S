//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
const Promise = require('bluebird');
/* jshint ignore:end */
const _ = require('lodash');

module.exports = {
  create: create,
  createReview: createReview,
  find: find,
  findOne: findOne,
  updateReview: updateReview,
  destroyReview: destroyReview,
};

function create(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Review.create-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  return Review.create(query)
    .then((review) => {
      return Review.findOne({
          where: {
            id: review.id
          }
        })
        .populate('photos', {
          sort: 'index ASC'
        });
    })
    .then((review) => {
      return res.ok(review);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function createReview(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Review.createReview-- :::\n", queryWrapper);
  let query = queryWrapper.query;

  if (!QueryService.checkParamPassed(query.place)) {
    return res.badRequest({ message: 'place' });
  }

  return Review.create(query)
    .then((review) => {
      let placeFindOne = Place.findOne({
          id: review.place
        })
        .populate('reviews');
      return [placeFindOne, review];
    })
    .spread((place, review) => {
      let ratings = _.pluck(place.reviews, 'rating'); // place.reviews emmute?

      // Mean start
      let ratingTotal = _.reduce(ratings, (mem, rating) => {
        return mem + rating;
      }, 0);
      let ratingAverage = ratingTotal / (ratings.length || 1);
      // Mean end

      let placeUpdate = Place.update({
        id: place.id
      }, {
        averageRating: ratingAverage
      });
      return [review, placeUpdate];
    })
    .spread((review) => {
      return res.ok(review);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Review.find-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;
  if (!query.limit) {
    query.limit = 101;
  } else {
    query.limit = query.limit + 1;
  }

  //====================================================
  // REFACTOR Nested Search Term
  //====================================================
  let newSearchTermPromise;
  if (Array.isArray(query.where.or)) {
    // places
    let placeSearchWordWrapper = _.compact(_.pluck(query.where.or, 'place'))[0];
    let placeSearchWord;
    let placesPromise;
    if (placeSearchWordWrapper) {
      placeSearchWord = placeSearchWordWrapper.contains;
      placesPromise = Place.find({
        where: {
          name: { contains: placeSearchWord }
        }
      });
    }
    // owners
    let ownerSearchWordWrapper = _.compact(_.pluck(query.where.or, 'owner'))[0];
    let ownerSearchWord;
    let ownersPromise;
    if (ownerSearchWordWrapper) {
      ownerSearchWord = ownerSearchWordWrapper.contains;
      ownersPromise = User.find({
        where: {
          nickname: { contains: ownerSearchWord }
        }
      });
    }

    newSearchTermPromise = Promise.all([placesPromise, ownersPromise])
      .spread((places, owners) => {
        // places
        if (placeSearchWordWrapper) {
          let placeIds = _.pluck(places, 'id');
          var placeIndex = _.findIndex(query.where.or, { place: { contains: placeSearchWord } });
          query.where.or.splice(placeIndex, 1, { place: placeIds });
        }
        // owners
        if (ownerSearchWordWrapper) {
          let ownerIds = _.pluck(owners, 'id');
          var ownerIndex = _.findIndex(query.where.or, { owner: { contains: ownerSearchWord } });
          query.where.or.splice(ownerIndex, 1, { owner: ownerIds });
        }
      });

  } else {
    newSearchTermPromise = Promise.resolve();
  }
  //====================================================
  // REFACTOR Nested Search Term ends
  //====================================================
  newSearchTermPromise
    .then(() => {
      let reviewFind = Review.find(query);
      _.forEach(populate, (populateProp) => {
        if (typeof populateProp === 'string') {
          reviewFind = reviewFind.populate(populateProp);
        } else {
          reviewFind = reviewFind.populate(populateProp.property, populateProp.criteria);
        }
      });

      let countPromise = Review.count(query);

      return Promise.all([reviewFind, countPromise]);

    })
    .spread((reviews, count) => {
      let more = (reviews[query.limit - 1]) ? true : false;
      if (more) {
        reviews.splice(query.limit - 1, 1);
      }
      return res.ok({
        reviews: reviews,
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
  sails.log("queryWrapper --Reivew.findOne-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  if (!QueryService.checkParamPassed(query.where.id)) {
    return res.badRequest({ message: 'id' });
  }

  let reviewFindOne = Review.findOne(query);
  _.forEach(populate, (populateProp) => {
    if (typeof populateProp === 'string') {
      reviewFindOne = reviewFindOne.populate(populateProp);
    } else {
      reviewFindOne = reviewFindOne.populate(populateProp.property, populateProp.criteria);
    }
  });

  return reviewFindOne
    .then((review) => {
      review.viewCount = review.viewCount + 1;
      let deferred = Promise.pending();
      review.save((err) => {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(review);
        }
      });
      return deferred.promise;
    })
    .then((review) => {
      return res.ok(review);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function updateReview(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Review.update-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  query.updatedBy = req.user && req.user.id;
  let id = query.id;
  delete query.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.badRequest({ message: "!id" });
  }

  let propertiesAllowedToUpdate = [
    'rating', 'content', 'photos', 'place'
  ];
  let propertiesToUpdate = {};
  _.forEach(propertiesAllowedToUpdate, (property) => {
    if (query[property]) {
      propertiesToUpdate[property] = query[property];
    }
  });

  return Review.update({ id: id }, propertiesToUpdate)
    .then((reviews) => {
      let review = reviews[0];
      let placeFindOne = Place.findOne({
          id: review.place
        })
        .populate('reviews');

      return [placeFindOne, review];
    })
    .spread((place, review) => {
      let ratings = _.pluck(place.reviews, 'rating'); // place.reviews emmute?
      // Mean start
      let ratingTotal = _.reduce(ratings, (mem, rating) => {
        return mem + rating;
      }, 0);
      let ratingAverage = ratingTotal / (ratings.length || 1);
      // Mean end
      let placeUpdate = Place.update({
        id: place.id
      }, {
        averageRating: ratingAverage
      });
      sails.log("ratingAverage :::\n", ratingAverage);
      return [review, placeUpdate];
    })
    .spread((review) => {
      return res.ok(review);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


// Associations to Delete
// photos, comments
function destroyReview(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Review.destroy-- :::\n", queryWrapper);
  var query = queryWrapper.query;

  var id = query.where.id;
  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }

  return Review.findOne({ id: id })
    .populate('photos')
    .populate('comments')
    .then((review) => {
      if (!review) {
        return Promise.reject({ message: 'no review' });
      }
      let photoIds = _.pluck(review.photos, 'id');
      let photos = ImageService.destroyPhotos(photoIds);

      let commentIds = _.pluck(review.comments, 'id');
      let comments = Comment.destroy({ id: commentIds });

      let reviews = Review.destroy({ id: review.id });

      return [reviews, comments, photos];
    })
    .spread((reviews) => {
      let review = reviews[0];
      let placeFindOne = Place.findOne({
          id: review.place
        })
        .populate('reviews');

      return [placeFindOne, review];
    })
    .spread((place, review) => {
      let ratings = _.pluck(place.reviews, 'rating'); // place.reviews emmute?
      // Mean start
      let ratingTotal = _.reduce(ratings, (mem, rating) => {
        return mem + rating;
      }, 0);
      let ratingAverage = ratingTotal / (ratings.length || 1);
      // Mean end
      let placeUpdate = Place.update({
        id: place.id
      }, {
        averageRating: ratingAverage
      });
      sails.log("ratingAverage :::\n", ratingAverage);
      return [review, placeUpdate];
    })
    .spread((review) => {
      return res.ok(review);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}
