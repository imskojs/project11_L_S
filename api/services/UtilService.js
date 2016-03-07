'use strict';

var jwt = require('jsonwebtoken');
var _ = require('lodash');


module.exports = {

  // Token
  getToken: function(userinfo) {

    var secret = sails.config.session.secret;
    var token = jwt.sign(userinfo, secret, {
      'expiresIn': "365 days"
    });

    return token;
  },

  verifyToken: function(token, callback) {
    var secret = sails.config.session.secret;
    jwt.verify(token, secret, callback);
  },

  userInfoParser: function(provider, data) {


    var user = {
      username: data.id
    };

    switch (provider) {
      case 'kakao':
        user = _.extend(user, data.properties);
        break;
      case 'facebook':
        user.firstname = data.first_name;
        user.lastname = data.last_name;
        user.nickname = data.name;
        user.email = data.email;
        user.profile_image = 'http://graph.facebook.com/' + data.id + '/picture';
        break;
    }

    return user;
  }
};
