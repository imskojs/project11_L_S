//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

module.exports = {
  pushAll: pushAll,
  register: register,
  update: update,
  pushOff: pushOff,
  pushOn: pushOn
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

// empty
function pushOff(req, res) {
  if (!req.user) {
    return res.badRequest({ message: '!loggedIn' });
  }
  return Device.update({ user: req.user.id }, { active: false })
    .then(function(devices) {
      return res.ok({
        devices: devices
      });
    })
    .catch(function(err) {
      return res.badRequest(err);
    });
}

function pushOn(req, res) {
  if (!req.user) {
    return res.badRequest({ message: '!loggedIn' });
  }
  return Device.update({ user: req.user.id }, { active: true })
    .then(function(devices) {
      return res.ok({
        devices: devices
      });
    })
    .catch(function(err) {
      return res.badRequest(err);
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
        device: createdDevice
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


// {deviceId, etc}
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
