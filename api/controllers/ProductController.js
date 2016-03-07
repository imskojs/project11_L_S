//====================================================
//  Touched by Ko 2.16
//====================================================
'use strict';
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
  create: create,
  find: find,
  findOne: findOne,
  update: update,
  destroy: destroy,
  //====================================================
  //  Not used
  //====================================================
  findNative: findNative,
};

function create(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Product.create-- :::\n", queryWrapper);
  var query = queryWrapper.query;
  if (!QueryService.checkParamPassed(query.category, query.name, query.price, query.place)) {
    return res.send(400, { message: "!category || !name || !price || !place" });
  }
  return Product.create(query)
    .then((product) => {
      if (Array.isArray(product)) {
        return res.ok({
          products: product
        });
      } else {
        return res.ok(product);
      }
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Product.find-- :::\n", queryWrapper);
  var query = queryWrapper.query;
  let populate = queryWrapper.populate;

  let productPromise = Product.find(query);
  QueryService.applyPopulate(productPromise, populate);
  let countPromise = Product.count(query);
  return Promise.all([productPromise, countPromise])
    .spread((products, count) => {
      let more = (products[query.limit - 1]) ? true : false;
      if (more) {
        products.pop();
      }
      return res.ok({
        products: products,
        more: more,
        total: count
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function findOne(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Product.findOne-- :::\n", queryWrapper);
  var query = queryWrapper.query;
  let populate = queryWrapper.populate;
  let productPromise = Product.findOne(query);
  QueryService.applyPopulate(productPromise, populate);
  return productPromise
    .then((product) => {
      if (!product) {
        return Promise.reject({
          message: '!hasProduct'
        });
      }
      return res.ok(product);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function update(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Product.update-- :::\n", queryWrapper);
  var query = queryWrapper.query;
  query.updatedBy = req.user.id;
  let id = query.id;
  delete query.id;

  if (!QueryService.checkParamPassed(id)) {
    return res.badRequest({ message: "!id" });
  }

  let propertiesAllowedToUpdate = [
    'category', 'name', 'price', 'place', 'photos' /* no photo for JooDang*/
  ];
  let propertiesToUpdate = {};
  _.forEach(propertiesAllowedToUpdate, (property) => {
    if (query[property]) {
      propertiesToUpdate[property] = query[property];
    }
  });

  return Product.update({ id: id }, propertiesToUpdate)
    .then((products) => {
      let product = products[0];
      return Product.findOne({ id: product.id })
        .populate('photos');
    })
    .then((product) => {
      return res.ok(product);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function destroy(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Product.destroy-- :::\n", queryWrapper);
  var query = queryWrapper.query;
  var id = query.where.id;
  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "!id" });
  }
  return Product.destroy({
      id: id
    })
    .then((products) => {
      let product = products[0];
      return res.ok(product);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function findNative(req, res) {

  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Product.findNative  -------------");
  sails.log(queryWrapper);

  return Promise.resolve(QueryService.executeNative(Product, queryWrapper))
    .spread((products, more, count) => {
      res.ok({
        products: products,
        more: more,
        total: count
      });
    })
    .catch((err) => {
      sails.log.error(err);
      res.send(500, {
        message: "장소 로딩을 실패 했습니다. 서버에러 code: 001"
      });
    });
}
