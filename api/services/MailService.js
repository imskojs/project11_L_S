/* jshint ignore:start */
'use strict';
var Promise = require('bluebird');
/* jshint ignore:end */
var smtp = require('activator').smtp();
var transport, from, templates, mailer;
var _ = require('lodash');
var fs = require('fs');

module.exports = {
  init: init,
  sendEmail: sendMail,
  sendToUsers: sendToUsers
};

function init() {
  transport = sails.config.connections.email;
  from = "Applicatteam <applicatteam@applicat.co.kr>";
  templates = __dirname + "/../../assets/mail_template/";
  mailer = smtp(transport, templates);
}

function sendMail(template, lang, data, from, to, callback, attachments) {
  mailer(template, lang || "kr", data, from, to, callback, attachments);
}

//( users: Array<User>, 
//  template: String, 
//  data: Object, 
//  from: String:Email, 
//  callback: Function,
//  attachments: Array<FilePath>
//) =>
// Promise
function sendToUsers(users, template, data, from, attachments) {
  if (!Array.isArray(users)) {
    users = [users];
  }
  let promiseContainer = [];
  _.forEach(users, (user) => {
    if (user && user.email) {
      sails.log("user :::\n", user);
      let deferred = Promise.pending();
      sendMail(template, 'kr', data, from, user.email, function(err) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve({ sent: user });
        }
      }, attachments);
      promiseContainer.push(deferred.promise);
    }
  });
  sails.log("promiseContainer :::\n", promiseContainer);
  return Promise.all([Promise.all(promiseContainer), attachments])
    .spread((arrayOfSentObj /*: Array<{sent: User}*/ , attachments) => {
      sails.log("arrayOfSentObj :::\n", arrayOfSentObj);
      _.forEach(attachments, (image) => {
        fs.unlink(image.fd);
      });
      return arrayOfSentObj;
    });

}
