//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
/* jshint ignore:end */
const request = require('supertest');

describe('UserController', () => {
  describe('#findFive', () => {
    it('should pass', (done) => {
      request(sails.hooks.http.app)
        .get('/banner/findFive')
        .query({ apple: 'apple', 'ba': 'ba' })
        .expect((res) => {
          sails.log("res.body :::\n", res.body);
        })
        .end((err) => {
          if (err) {
            throw err;
          }
          done(err, 'success');
        });
    });
  });

});
