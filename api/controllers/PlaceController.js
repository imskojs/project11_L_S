//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
var Promise = require('bluebird');
/* jshint ignore:end */

var _ = require('lodash');
module.exports = {
  create: create,
  findNative: findNative,
  find: find,
  findOne: findOne,
  update: update,
  destroy: destroy,
  updateProducts: updateProducts
};

// TODO: update, destroy
function create(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Place.create-- :::\n", queryWrapper);
  let query = queryWrapper.query; // query.photos = ['asdf', 'asdf']
  return Place.create(query)
    .then((place) => {
      return Place.findOne({
          where: {
            id: place.id
          }
        })
        .populate('photos', {
          sort: 'index ASC'
        });
    })
    .then((place) => {
      return res.ok(place);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function findNative(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Place.findNative-- :::\n", queryWrapper);
  // queryWrapper = {
  // query: {
  //   where: {
  //     geoJSON: {
  //       $near: {
  //         $geometry: {
  //           type: "Point",
  //           coordinates: [150, 35]
  //         },
  //         $maxDistance: 5000
  //       }
  //     },
  //     category: 'PREMIUM' || 'SPECIAL' || 'NORMAL'
  //       // tags: {$in: tags }, 
  //       // filter = new RegExp([filter].join(""), "i");
  //       // $or: [{'name': filter }, {'description': filter }, {'createdBy': filter }],
  //       // id: {$gt: someId }, id: {$lt: someId }
  //   },
  //   skip: 30,
  //   limit: 30,
  //   populate: [{property: 'photos', criteria: {sort: 'index ASC'}}]
  // }
  // }
  let query = queryWrapper.query.where;

  // if search
  if (query.searchWord) {
    let searchWord = query.searchWord;
    delete query.searchWord;
    let searchRegExp = new RegExp(searchWord, 'i');
    query.$or = [{
      name: searchRegExp
    }, {
      tagString: searchRegExp
    }];
  }

  let skip = queryWrapper.query.skip;
  let limit = queryWrapper.query.limit + 1;
  let populate = queryWrapper.populate;
  sails.log("query --processed query.where-- :::\n", query);


  let PlaceNative = Promise.promisify(Place.native);
  return PlaceNative()
    .then((PlaceCollection) => {
      let deferred = Promise.pending();

      let cursor = PlaceCollection.find(query);
      if (skip) {
        cursor.skip(skip);
      }
      if (limit) {
        cursor.limit(limit);
      }
      cursor.toArray((err, places) => {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(places);
        }
      });

      return deferred.promise;
    })
    .then((nativePlaces) => {
      sails.log("nativePlaces :::\n", nativePlaces);
      let ids = _.map(nativePlaces, (nativePlace) => {
        let id = nativePlace._id.toString();
        return id;
      });

      let placesPromise = Place.find({
        id: ids
      });
      _.forEach(populate, (populateProp) => {
        if (typeof populateProp === 'string') {
          placesPromise = placesPromise.populate(populateProp);
        } else {
          placesPromise = placesPromise.populate(populateProp.property, populateProp.criteria);
        }
      });

      return [placesPromise, ids];
    })
    .spread((unOrderedPlaces, ids) => {
      let places = _.map(ids, (id) => {
        return _.find(unOrderedPlaces, { id: id });
      });
      let more = (places[limit - 1]) ? true : false;
      if (more) {
        places.splice(limit - 1, 1);
      }
      return res.ok({
        places: places,
        more: more
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Place.find-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;
  if (!query.limit) {
    query.limit = 101;
  } else {
    query.limit = query.limit + 1;
  }

  let placesPromise = Place.find(query);
  _.forEach(populate, (populate) => {
    if (typeof populate === 'string') {
      placesPromise = placesPromise.populate(populate);
    } else {
      placesPromise = placesPromise.populate(populate.property, populate.criteria);
    }
  });

  let countPromise = Place.count(query);

  return Promise.all([placesPromise, countPromise])
    .spread((places, count) => {
      let more = (places[query.limit - 1]) ? true : false;
      if (more) {
        places.splice(query.limit - 1, 1);
      }
      return res.ok({
        places: places,
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
  sails.log("queryWrapper --Place.findOne-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  if (!QueryService.checkParamPassed(query.where.id)) {
    return res.send(400, {
      message: "id"
    });
  }

  let placePromise = Place.findOne(query);
  _.forEach(populate, (populateProp) => {
    if (typeof populateProp === 'string') {
      placePromise = placePromise.populate(populateProp);
    } else {
      placePromise = placePromise.populate(populateProp.property, populateProp.criteria);
    }
  });

  return placePromise
    .then((place) => {
      place.viewCount = place.viewCount + 1;
      let deferred = Promise.pending();
      place.save((err) => {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(place);
        }
      });
      return deferred.promise;
    })
    .then((place) => {
      return res.ok(place);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function update(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Place.update-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  query.updatedBy = req.user && req.user.id;
  let id = query.id;
  delete query.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.badRequest({ message: "id" });
  }

  let propertiesAllowedToUpdate = [
    'photos', 'name', 'tagString', 'tags', 'category', 'province', 'theme', 'keywords',
    'address', 'geoJSON', 'hours', 'size', 'summary', 'showDiscountTag', 'discountTitle',
    'discountContent', 'showEventTag', 'eventContent', 'phone'
  ];
  let propertiesToUpdate = {};
  _.forEach(propertiesAllowedToUpdate, (property) => {
    if (query[property]) {
      propertiesToUpdate[property] = query[property];
    }
  });

  return Place.update({ id: id }, propertiesToUpdate)
    .then((updatedPlace) => {
      let place = updatedPlace[0];
      return Place.findOne({ id: place.id })
        .populate('photos');
    })
    .then((place) => {
      return res.ok(place);
    })
    .catch((err) => {
      return res.negotiate(err);
    });

}

// Associations to Delete
//products, reviews, photos
function destroy(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Place.destory-- :::\n", queryWrapper);
  let query = queryWrapper.query;

  let id = query.where.id;
  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }

  return Place.findOne({ id: id })
    .populate('photos') // Associations to delete
    .populate('products')
    .populate('reviews')
    .then((place) => {
      if (!place) {
        return Promise.reject({ message: 'no place' });
      }
      let photoIds = _.pluck(place.photos, 'id');
      let photos = ImageService.destroyPhotos(photoIds);

      let productIds = _.pluck(place.products, 'id');
      let products = Product.destroy({ id: productIds });

      let reviewIds = _.pluck(place.reviews, 'id');
      let reviews = Review.destroy({ id: reviewIds });

      let places = Place.destroy({ id: place.id });

      let reviewComments;
      if (Array.isArray(reviewIds) && reviewIds.length > 0) {
        reviewComments = Comment.destroy({ review: reviewIds });
      }

      return [places, reviews, products, photos, reviewComments];
    })
    .spread((places) => {
      let place = places[0];
      return res.ok(place);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

// {place:id, products: Array<Object>}
function updateProducts(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  var query = queryWrapper.query;
  var place = query.place;
  delete query.place;
  if (!QueryService.checkParamPassed(place)) {
    return res.send(400, { message: "!place" });
  }
  return Product.destroy({ place: place })
    .then((destroyedProducts) => {
      sails.log("destroyedProducts :::\n", destroyedProducts);
      let products = [];
      _.forEach(query.products, (product) => {
        if (product.name && product.price) {
          delete product.id;
          delete product.createdAt;
          delete product.updatedAt;
          product.place = place;
          product.createdBy = req.user && req.user.id;
          product.updateddBy = req.user && req.user.id;
          products.push(product);
        }
      });
      return Product.create(products);
    })
    .then((createdProducts) => {
      sails.log("createdProducts :::\n", createdProducts);
      return Product.find({
        where: { place: place },
        sort: 'id ASC'
      });
    })
    .then((products) => {
      return res.ok({
        products: products
      });

    })
    .catch((err) => {
      return res.negotiate(err);
    });
}
