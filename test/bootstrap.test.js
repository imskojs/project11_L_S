//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
const sails = require('sails');
/* jshint ignore:end */

before((done) => {
  sails.lift({
    models: {
      connection: 'testServer',
      migration: 'drop'
    }
  }, (err) => {
    if (err) {
      return done(err);
    }
    done(err, sails);
  });
});

after((done) => {
  sails.lower(done);
});
