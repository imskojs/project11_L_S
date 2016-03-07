// api/models/User.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/User');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  schema: false,
  attributes: {
    username: {
      type: 'string',
      unique: true,
      index: true
    },
    email: {
      type: 'email',
      unique: true,
      index: true
    },

    // Properties
    nickname: {
      // unique: true,
      type: 'String'
    },

    profilePhoto: {
      model: 'Photo'
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

  },
  afterCreate: function setOwner(user, next) {

    sails.log('User.afterCreate.setOwner', user);

    User
      .update({
        id: user.id
      }, {
        owner: user.id
      })
      .then(function(users) {

        sails.log.debug("User update assign owner: " + users[0].toJSON());

        return [User.findOne({
            id: users[0].id
          }).populate('roles'),
          Role.find({
            name: 'USER'
          })
        ];
      })
      .spread(function(user, roles) {

        sails.log.debug("User assigning default role: " + JSON.stringify(user));

        if (user)
          if (!user.roles || user.roles.length === 0) {
            User.update({
                id: user.id
              }, {
                roles: roles
              })
              .exec(function(err, users) {
                sails.log.debug("User default assign done: " + JSON.stringify(users));
              });
          }

        next();
      })
      .catch(function(e) {
        sails.log.error(e);
        next(e);
      });

  }

});
