//====================================================
//  Touched by Ko 2.16
//====================================================
'use strict';
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
  create: create,
  find: find,
  findFive: findFive,
  findOne: findOne,
  update: update,
  destroy: destroy,
};

// query: {isExternal, homepage, index, event?, photo?}
function create(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Banner.create-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  if (!QueryService.checkParamPassed(query.index)) {
    return res.send(400, { message: "!index" });
  }
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

// query: null
function findFive(req, res) {
  return Banner.find({
      where: {},
      sort: 'index ASC',
      limit: 5
    }).populate('photo')
    .then((banners) => {
      return res.ok({
        banners: banners
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
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper -- Banner.update -- :::\n", queryWrapper);
  let query = queryWrapper.query;
  query.updatedBy = req.user.id;
  let id = query.id;
  delete query.id;
  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, {
      message: "id"
    });
  }

  let propertiesAllowedToUpdate = [
    'isExternal', 'homepage', 'index', 'event', 'photo'
  ];
  let propertiesToUpdate = {};
  _.forEach(propertiesAllowedToUpdate, (property) => {
    if (query[property] !== undefined) {
      propertiesToUpdate[property] = query[property];
    }
  });

  return Banner.update({
      id: id
    }, propertiesToUpdate)
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
