// config/passport.js

'use strict';
var _ = require('lodash');
var _super = require('sails-permissions/config/passport');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  local: {
    strategy: require('passport-local').Strategy
  },

  facebook: {
    name: 'Facebook',
    protocol: 'oauth2',
    strategy: require('passport-facebook').Strategy,
    options: {

      //TODO: change this to different app id
      clientID: '983668071678162',
      clientSecret: '7cb83959061ec848f44b46e01789c99e',
      scope: ['email'] /* email is necessary for login behavior */
    }
  },

  kakao: {
    name: 'KAKAO',
    protocol: 'oauth2',
    strategy: require('passport-kakao').Strategy,
    options: {
      //clientID: '43865',
      //clientSecret: '30ba6a95be09274f51f2b31393818c6b'
      clientID: '05874336299d1f7e2e3f3de0af21b127',
      scope: ['story_publish', 'story_read', 'profile']
    }
  }


});
