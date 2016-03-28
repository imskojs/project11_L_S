// api/models/User.js

/* jshint ignore:start */
var Promise = require('bluebird');
/* jshint ignore:end */
var _ = require('lodash');
var _super = require('sails-permissions/api/models/User');
_.merge(exports, _super);
_.merge(exports, {
  schema: false,
  attributes: {
    username: {
      type: 'string',
      unique: true,
      index: true
    },
    name: {
      type: 'String'
    },
    mobilePhone: {
      type: 'String'
    },
    profilePhoto: {
      model: 'Photo'
    },
    // roles set in _super

    //====================================================
    //  User
    //====================================================
    phone: { //optional
      type: 'String'
    },
    email: {
      type: 'email',
      unique: true
    },
    userType: { // '개인', '사업자', '주선사업자'
      type: 'String'
    },
    favorites: {
      collection: 'Favorite',
      via: 'owner'
    },
    //====================================================
    //  Driver
    //====================================================
    vehicleWeight: {
      type: 'String'
    },
    vehicleType: {
      type: 'String'
    },
    maxLoadable: {
      type: 'String'
    },
    vehicleNumber: {
      type: 'String'
    },
    driverSummary: { //optional
      type: 'String'
    },
    // Association
    photos: { // optional
      collection: 'Photo',
      via: 'vehicle'
    },

    devices: {
      collection: 'Device',
      via: 'user'
    },
    //====================================================
    //  Not used
    //====================================================
    password_reset_code: {
      type: 'string'
    },
    password_reset_time: {
      type: 'integer'
    },
    accesscount: {
      type: 'integer'
    },
    owner: {
      model: 'User'
    },
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    }
  },

  afterCreate: function setOwner(user, next) {
    return User.update({ id: user.id }, { owner: user.id })
      .then(function(users) {
        var user = users[0];
        var userFindOne = User.findOne({
            id: user.id
          })
          .populate('roles');
        var roleFind = Role.find({ name: 'USER' });
        return [userFindOne, roleFind];
      })
      .spread(function(user, roles) {
        if (user) {
          if (!user.roles || user.roles.length === 0) {
            return User.update({ id: user.id }, { roles: roles });
          }
        } else {
          return Promise.resolve();
        }
      })
      .then(function() {
        next();
      })
      .catch(function(err) {
        sails.log.error(err);
        next(err);
      });
  }
});
