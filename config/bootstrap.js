/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

// var _ = require('lodash');
module.exports.bootstrap = function(cb) {
  //UserService.init();
  ImageService.init();
  MailService.init();

  return Place.native((err, placeColl) => {
    placeColl.ensureIndex({
      geoJSON: '2dsphere'
    }, () => {
      cb();
      // Place.find()
      //   .then((places) => {
      //     var ids = _.pluck(places, 'id');
      //     _.forEach(places, (place) => {
      //       delete place.id;
      //       place.theme = [place.theme];
      //     });
      //     return Place.update({ id: ids }, places);
      //   })
      //   .then((updatedPlaces) => {
      //     sails.log("updatedPlaces :::\n", updatedPlaces);
      //     cb();
      //   })
      //   .catch((err) => {
      //     sails.log("err :::\n", err);
      //     cb();
      //   });
    });
  });
};