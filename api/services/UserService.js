'use strict';

var bcrypt = require('bcryptjs'),
  activator = require("activator");

module.exports = {

  init: function() {

    var transport = sails.config.connections.email;

    //var transport = mailer.createTransport(smtpTransport(options));

    var config = {
      transport: transport,
      user: {
        find: function(id, cb) {
          User.findOne({
            email: id
          }).exec(cb);
        },
        save: function(id, data, cb) {
          User.update({
            "email": id
          }, data).exec(cb);
        }
      },
      from: "Applicatteam <applicatteam@applicat.co.kr>",
      templates: __dirname + "/../../assets/mail_template/",
      id: "email"
    };

    activator.init(config);
  },

  getService: function() {

    return activator;
  },

  sendActivationEmail: function(request, response, callback) {
    this.getService().createActivateNext(request, response, callback);
  },

  completeActivation: function(request, response, callback) {
    this.getService().completeActivateNext(request, response, callback);
  },

  sendPasswordResetEmail: function(request, response, callback) {
    this.getService().createPasswordResetNext(request, response, callback);
  },

  completePasswordReset: function(request, response, callback) {
    this.getService().completePasswordResetNext(request, response, callback);
  },

  /*    Bcrypt service   */

  compare: function(enteredPassword, originalPassword, next) {
    bcrypt.compare(enteredPassword, originalPassword, next);
  },

  compareSync: function(enteredPassword, originalPassword) {
    return bcrypt.compareSync(enteredPassword, originalPassword);
  },

  createPassword: function(password, callback) {
    bcrypt.hash(password, 11, callback);
  }

};
