//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
/* jshint ignore:end */
const apn = require('apn');
const _ = require('lodash');

module.exports = {
  sendAll: sendAll,
  sendToADevice: sendToADevice
};

//Device: {deviceId: string, platform: enum{'ANDROID', 'IOS'}, ?}
//(devices: Device[], title: string, message: string, data?: Object, collapseKey?: string)
//=> void
function sendAll(devices, title, message, data, collapseKey) {
  _.forEach(devices, (device) => {
    sendToADevice(device, title, message, data, collapseKey);
  });
}

//Device: {deviceId: string, platform: enum{'ANDROID', 'IOS'}, ?}
//(device: Device, title: string, message: string, data?: Object, collapseKey?: string)
//=> void
function sendToADevice(device, title, message, data, collapseKey) {
  collapseKey = collapseKey || 'NEWS_TO_USER';
  let gcm = sails.config.connections.gcm;
  let apnConnection = new apn.Connection(sails.config.connections.apnConfig);
  if (device.platform === 'ANDROID') {
    gcm.send({
      registrationId: device.deviceId,
      collapseKey: collapseKey,
      delayWhileIdle: true,
      timeToLive: 3600,
      data: {
        title: title,
        message: message
      }
    });
  } else if (device.platform === 'IOS') {
    let myDevice = new apn.Device(device.deviceId);
    let note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 0;
    note.sound = "ping.aiff";
    note.alert = title;
    note.payload = {
      'message': message
    };
    apnConnection.pushNotification(note, myDevice);
  }
}


// var apn = require('apn');
// module.exports = {
//   getAndroidPushService: function() {
//     return sails.config.connections.gcm;
//   },
//   getIOSPushService: function() {
//     return new apn.Connection(sails.config.connections.apnConfig);
//   },
//   sendAll: function(devices, title, message, data, collapseKey) {
//     collapseKey = collapseKey || 'NEWS_TO_USER';
//     // Fetchd push services
//     var gcm = this.getAndroidPushService();
//     var apnConnection = this.getIOSPushService();
//     for (var i = 0; i < devices.length; i++) {
//       switch (devices[i].platform) {
//         case 'ANDROID':
//           sails.log.debug({
//             deviceId: devices[i].deviceId,
//             title: title,
//             message: message
//           });
//           gcm.send({
//             registrationId: devices[i].deviceId,
//             collapseKey: collapseKey,
//             delayWhileIdle: true,
//             timeToLive: 3600,
//             data: {
//               title: title,
//               message: message
//             }
//           });
//           break;
//         case 'IOS':
//           var myDevice = new apn.Device(devices[i].deviceId);
//           var note = new apn.Notification();
//           note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
//           note.badge = 0;
//           note.sound = "ping.aiff";
//           note.alert = title;
//           note.payload = {
//             'message': message
//           };
//           apnConnection.pushNotification(note, myDevice);
//           break;
//       }
//     }
//   }
// };
// function sendPushToSubscribeDevice(post) {
//   return Device.find({
//       optionalType: post.optionalType
//     })
//     .exec(function(err, devices) {
//       if (err) {
//         console.log("SendPushToSubscribeDevice - DB Error");
//       } else if (devices == undefined || devices == null) {
//         console.log("SendPushToSubscribeDevice - No devices");
//       } else {
//         console.log("SendPushToSubscribeDevice - Sending push notification to devices");
//         console.log(JSON.stringify(post));
//         PushService.sendAll(devices, post.title, post.content, post, '새로운 글');
//       }
//     });
// }
