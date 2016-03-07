//====================================================
//  Touched by Ko 2.16
//====================================================
'use strict';

module.exports = {
  pushAll: pushAll,
  register: register,
  update: update
};

function pushAll(req, res) {
  let title = req.params.title;
  let message = req.params.message;
  sails.log("title, message --Device.pushAll-- :::\n", title, message);

  if (!QueryService.checkParamPassed(title, message)) {
    return res.send(400, {
      message: "title/message"
    });
  }

  return Device.find({
      active: true
    })
    .then((devices) => {
      sails.log("devices :::\n", devices);
      PushService.sendAll(devices, title, message);
      return res.ok({
        message: 'Message sent.'
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function register(req, res) {
  var device = req.allParams();
  sails.log("device --Device.register-- :::\n", device);

  if (!QueryService.checkParamPassed(device.deviceId, device.platform)) {
    return res.send(400, {
      message: "deviceId/platform"
    });
  }

  return Device.findOrCreate({
      deviceId: device.deviceId
    }, device)
    .then((createdDevice) => {
      return res.ok({
        deivce: createdDevice
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


function update(req, res) {
  var device = req.allParams();
  sails.log("device --Device.update-- :::\n", device);

  if (!QueryService.checkParamPassed(device.deviceId, req.user)) {
    return res.send(400, { message: "!deviceId || !req.user" });
  }
  device.user = req.user;

  return Device.update({
      deviceId: device.deviceId
    }, device)
    .then((updatedDevice) => {
      return res.ok({
        device: updatedDevice
      });
    })
    .catch(function(err) {
      return res.negotiate(err);
    });
}
