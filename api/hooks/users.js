/**
 * Created by andy on 3/08/15
 * As part of applicatplatform
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 3/08/15
 *
 */

var Promise = require('bluebird');

module.exports = function (sails) {

  return {
    identity: 'users',
    /**
     * Local cache of Model name -> id mappings to avoid excessive database lookups.
     */
    _modelCache: {},

    initialize: function (next) {

      sails.log('UsersHook : initializing users hook');

      sails.after('hook:permissions:loaded', function () {
        return injectRole()
          .then(function () {
            return injectPermission();
          })
          .then(function () {
            return injectUser();
          })
          .then(function () {
            next();
          })
          .catch(function (error) {
            sails.log.error("error", error);
            next(error);
          });
      });
    }
  };
}

function injectRole() {

  sails.log('UsersHook : injecting role');

  var roleConfigs = sails.config.users.roles;

  var deferred = Promise.pending();
  var roleNames = _.pluck(roleConfigs, 'name');

  var promises = [];

  if (sails.config.users.drop)
    promises.push(Role.destroy());

  Promise.all(promises)
    .spread(function (roles) {
      return Role.find({name: roleNames});
    })
    .then(function (roles) {
      if (roles && roles.length > 0) {
        return null;
      } else {
        return Role.create(roleConfigs);
      }

    })
    .then(function (roles) {
      deferred.resolve(roles);
    })
    .catch(function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
}


function injectPermission() {

  sails.log('UsersHook : injecting permissions');

  var permissionConfigs = sails.config.users.permissions;

  var deferred = Promise.pending();

  var promises = [];

  promises.push(Role.find());
  promises.push(Model.find());
  promises.push(Permission.destroy());

  Promise.all(promises)
    .spread(function (roles, models) {
      var roles = roles;
      var models = models;

      var permissionsToCreate = [];

      _.each(roles, function (role) {
        _.each(permissionConfigs[role.name], function (permission) {
          permission.role = role.id;
          permission.model = _.find(models, {name: permission.model}, 'id')
          permissionsToCreate.push(permission);
        });
      });

      return Permission.create(permissionsToCreate);
    })
    .then(function (permissions) {
      deferred.resolve(permissions);
    })
    .catch(function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
}


function injectUser() {

  sails.log('UsersHook : injecting users');

  var initialUserConfig = sails.config.users.initialUser;

  var deferred = Promise.pending();

  var promises = [];

  promises.push(Role.find());

  if (sails.config.users.drop)
    promises.push(User.destroy());

  Promise.all(promises)
    .spread(function (roles) {

      var roles = roles;

      var userPromise = [];

      _.each(roles, function (role) {
        _.each(initialUserConfig[role.name], function (userToCreate) {

          var promise = new Promise(function (resolve, reject) {

            userToCreate.roles = [role.id];

            User.find({username: userToCreate.username})
              .then(function (users) {
                if (users && users.length > 0)
                  return null;
                else
                  return User.register(userToCreate);
              })
              .then(function (user) {
                resolve(user);
              })
              .catch(function (err) {
                reject(err);
              });
          });

          userPromise.push(promise);
        });
      });


      return Promise.all(userPromise);
    })
    .spread(function (user) {
      deferred.resolve(user);
    })
    .catch(function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
}


