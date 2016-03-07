/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

var assert = require('assert');
const _ = require('lodash');

describe('Query Service', function() {

  it('should exist', function() {
    assert.ok(sails.services.queryservice);
    assert.ok(global.QueryService);
  });

  describe('#buildQuery()', function() {
    it('should return array when string array is passed', function(done) {

      var params = {
        populate: '["123", "456"]'
      };

      var query = sails.services.queryservice.buildQuery({}, params);

      assert.equal(Array.isArray(query.populate), true);

      done();
    });

    it('should return array when array is passed', function(done) {

      var params = {
        populate: ["123", "456"]
      };

      var query = sails.services.queryservice.buildQuery({}, params);


      assert.equal(Array.isArray(query.populate), true);

      done();
    });

    it('should return array when array is passed', function(done) {

      var params = {
        populate: ["123", "456"],
        tags: '["123", "456"]',
        category: 'POST'
      };

      var query = sails.services.queryservice.buildQuery({}, params);

      assert.equal(Array.isArray(query.populate), true);
      assert.equal(Array.isArray(query.tags), true);
      assert.equal(typeof query.category === 'string', true);

      done();
    });
  });

  describe('#executeNative() && executeNative', function() {

    before(function() {
      // Create test data before hand

      var places = [
        {
          category: 'STATION',
          name: '강남역',
          address: '강남역 주소',
          geoJSON: [127.027642, 37.497959]
        },
        {
          category: 'STATION',
          name: '역삼역',
          address: '역삼역 주소',
          geoJSON: [127.037393, 37.499907]
        },
        {
          category: 'STATION',
          name: '교대역',
          address: '교대역 주소',
          geoJSON: [129.080029, 35.195550]
        },
        {
          category: 'STATION',
          name: '선릉역',
          address: '선릉역 주소',
          geoJSON: [127.048941, 37.504479]
        },
        {
          category: 'RANDOM',
          name: 'RANDOM1',
          address: 'RANDOM1 주소',
          geoJSON: [127.048941, 37.504479]
        },
        {
          category: 'RANDOM',
          name: 'RANDOM2',
          address: 'RANDOM2 주소',
          geoJSON: [127.048941, 37.504479]
        }
      ];

      var products = [
        {
          name: 'Product1'
        },
        {
          name: 'Product2'
        },
        {
          name: 'Product3'
        }
      ];

      return Place.create(places)
        .then(function(places) {

          _.each(products, function(product) {
            product.place = places[0].id;
          });

          return Product.create(products);
        });

    });

    it('should return stations array with size 3, more: true, count:4 ', function(done) {

      var query = {
        geoJSON: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [127.048941, 37.504479]
            }
          }
        },
        limit: 3,
        $or: [
          { category: 'STATION' }
        ],
        populate: ['products']
      };

      sails.services.queryservice.executeNative(Place, query)
        .spread(function(places, more, count) {

          console.log('places: ', places);
          console.log('more: ' + JSON.stringify(more));
          console.log('count: ' + JSON.stringify(count));

          assert.equal(places.length, 3);
          assert.equal(more, true);
          assert.equal(count, 4);

        })
        .then(done, done)
        .catch(function(err) {
          console.log(err);
        });
    });

    after(function() {
      return Place.destroy();
    });

  });


});
