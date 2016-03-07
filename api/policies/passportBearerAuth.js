'user strict'

/**
 * Created by Andy on 6/5/2015
 * As part of MyFitMate
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 6/5/2015
 *
 */


/*******************************************************************************
 * MyFitMate
 *
 * orBearerAuth Policy
 *
 ******************************************************************************/



module.exports = function (req, res, next) {

  var token;

  // Move on if already authenticated.

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0], credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      next();
    }

    Passport.findOne({accessToken: token}, function (err, passport) {
      if (err) {
        return next();
      }

      if (!passport) {
        return next();
      }

      User.findOne({id: passport.user})
        .populate('roles')
        .exec(function (err, user) {
          if (err) {
            return next();
          }
          if (!user) {
            return next();
          }

          req.token = token;
          req.user = user;
          req.session.authenticated = true;
          return next();
        });
    });

  }

};
