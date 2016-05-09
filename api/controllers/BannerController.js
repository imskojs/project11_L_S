/* globals Banner */
/* globals QueryService, ImageService */
//====================================================
//  Touched by Ko 2.16
//====================================================
'use strict'; // jshint ignore:line
const Promise = require('bluebird'); // jshint ignore:line
const _ = require('lodash');

module.exports = {
  create: create,
  find: find,
  findOne: findOne,
  update: update,
  destroy: destroy,
};

function create(req, res) {
  let query = req.allParams();
  sails.log("query --Banner.create--:::\n", query);

  return Banner.create(query)
    .then((createdBanner) => {
      return Banner.findOne({
        id: createdBanner.id
      }).populate('photo');
    })
    .then((banner) => {
      return res.ok(banner);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Banner.find--:::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let bannerPromise = Banner.find(query);
  QueryService.applyPopulate(bannerPromise, populate);
  let countPromise = Banner.count(query);

  return Promise.all([bannerPromise, countPromise])
    .spread((banners, count) => {
      let more = (banners[query.limit - 1]) ? true : false;
      if (more) {
        banners.pop();
      }
      return res.ok({
        banners: banners,
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
  sails.log("queryWrapper --Banner.findOne-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let bannerPromise = Banner.findOne(query);
  QueryService.applyPopulate(bannerPromise, populate);

  return bannerPromise
    .then((banner) => {
      return res.ok(banner);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


function update(req, res) {
  let query = req.allParams();
  sails.log("query -- banner.update -- :::\n", query);
  let id = query.id;
  delete query.id;
  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, {
      message: "id"
    });
  }
  let propertiesNotAllowedToUpdate = [
    'id'
  ];
  _.forEach(propertiesNotAllowedToUpdate, (property) => {
    if (query[property] !== undefined) {
      delete query[property];
    }
  });

  return Banner.update({
      id: id
    }, query)
    .then((banners) => {
      let banner = banners[0];
      return res.ok(banner);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


function destroy(req, res) {
  var query = req.allParams();
  // var queryWrapper = QueryService.buildQuery(req);
  // sails.log("-----------  queryWrapper: Post.destroy  -------------");
  // sails.log(queryWrapper);
  // var query = queryWrapper.query;
  var id = query.id;
  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, {
      message: "id"
    });
  }
  return Banner.destroy({
      id: id
    })
    .then((banners) => {
      let banner = banners[0];
      if (!banner) {
        return Promise.reject({ message: '!banner' });
      }
      let photo;
      if (banner.photo) {
        photo = ImageService.destroyPhoto(banner.photo);
      }
      return [banner, photo];
    })
    .spread((banner, photo) => {
      banner.photo = photo;
      return res.ok(banner);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}
