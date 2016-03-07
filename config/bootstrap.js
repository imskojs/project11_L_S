/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

module.exports.bootstrap = function(cb) {
  //UserService.init();
  ImageService.init();
  MailService.init();

  return Place.native((err, placeColl) => {
    placeColl.ensureIndex({
      geoJSON: '2dsphere'
    }, () => {
      cb();
    });
  });
};
