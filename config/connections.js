/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

var gcm = require('push-notify');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

module.exports.connections = {

  someMongodbServer: {
    adapter: 'sails-mongo',
    url: "mongodb://logisticsDbUser:applicat88@SG-Applicat-5222.servers.mongodirector.com:27017/logistics"
      // url: "mongodb://localhost:27017/logistics"
  },

  gcm: gcm.gcm({
    apiKey: 'AIzaSyBBBrQr0cGRpkAUA1_IsmRjZVQg60QOvK0'
  }),

  apnConfig: {
    "cert": __dirname + '/ssl/cert.pem',
    "key": __dirname + '/ssl/key.pem'
  },

  email: nodemailer.createTransport(smtpTransport({
    "host": "smtp.mandrillapp.com",
    "port": 587, // port for secure SMTP
    "secure": false,
    "auth": {
      "user": "developer@applicat.co.kr",
      "pass": "LYnyL4mY1At7NmpEZQs5vA"
    }
  })),

  //Dev
  cloudinary: {
    cloud_name: 'appdev',
    api_key: '355231636137138',
    api_secret: 'p_5ViDMlrlNZJFUP91trdUmo904',
    tags: ['APPLICAT', 'LOGISTICS']
  },

  //Production
  //cloudinary: {
  //  cloud_name: 'applicat',
  //  api_key: '992351679812158',
  //  api_secret: 'DHNaG-VHyUE8rVax4ay8YqbeQm8',
  //  tags: ['APPLICAT', 'LOGISTICS']
  //},

  /*
   *  User activate Service
   */

  activator: {
    from: "Applicatteam <applicatteam@applicat.co.kr>",
    url: {
      host: "smtp.mandrillapp.com",
      port: 2525,
      domain: "applicat.co.kr",
      secure: false,
      protocol: "SMTP",
      auth: {
        user: "applicatteam@applicat.co.kr",
        pass: "TGT5Zr4tZBQYXH37zJq_dg"
      }
    },
    templates: __dirname + "/../assets/mail_template/"
  }

};
