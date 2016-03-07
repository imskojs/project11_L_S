'use strict';
module.exports = {
  subscribeToRoom: subscribeToRoom,
  getMyRooms: getMyRooms,
};

function subscribeToRoom(req, res) {
  var roomName = req.param('roomName');

  sails.log(roomName);

  sails.sockets.join(req.socket, roomName);

  res.json({
    message: 'Subscribed to a fun room called ' + roomName + '!'
  });
}

function getMyRooms(req, res) {
  var roomNames = JSON.stringify(sails.sockets.socketRooms(req.socket));
  res.json({
    message: 'I am subscribed to: ' + roomNames
  });
}
