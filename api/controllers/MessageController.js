//====================================================
//  Touched by Ko 2.16
//====================================================
/* jshint ignore:start */
'use strict';
const Promise = require('bluebird');
/* jshint ignore:end */
const _ = require('lodash');

module.exports = {
  create: create,
  find: find,
  findUnique: findUnique,
  destroy: destroy,
};

// {receiver: placeOwner, content:''}
function create(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Message.create-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  query.sender = req.user.id; // sender, receiver, content
  return Message.create(query)
    .then((message) => {
      return [
        Device.find({ user: message.receiver, active: true }),
        User.findOne({ id: message.sender })
      ];
    })
    .spread((devices, user) => {
      PushService.sendAll(devices,
        user.nickname + '으로부터 새로운 쪽지가 도착하였습니다',
        query.content
      );
      return Message.find({
        where: {
          or: [{
            sender: query.sender,
            receiver: query.receiver
          }, {
            receiver: query.sender,
            sender: query.receiver
          }]
        },
        sort: 'id ASC'
      });
    })
    .then((messages) => {
      let usersPromise = _.map(messages, (message) => {
        return User.findOne({
            id: message.sender
          })
          .populate('profilePhoto');
      });
      return [messages, Promise.all(usersPromise)];
    })
    .spread((messages, users) => {
      _.forEach(messages, (message, i) => {
        message.sender = users[i];
      });
      return messages;
    })
    .then((messages) => {
      return res.ok({
        messages: messages
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function find(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Message.find-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  let userId = req.user && req.user.id;
  // {
  //   where: {
  //     or: [{
  //       sender: query.sender,
  //       receiver: query.receiver
  //         }, {
  //       receiver: query.sender,
  //       sender: query.receiver
  //     }],
  //     '>': id
  //   },
  //   sort: 'id ASC',
  // }
  return Message.find(query)
    .then((messages) => {
      let usersPromise = _.map(messages, (message) => {
        let senderPromise = User.findOne({
            id: message.sender
          })
          .populate('profilePhoto');
        let receiverPromise = User.findOne({
          id: message.receiver
        });
        return Promise.all([senderPromise, receiverPromise]);
      });
      return [messages, Promise.all(usersPromise)];
    })
    .spread((messages, users) => {
      // users = [[sender, receiver], ... [sender, receiver]]
      _.forEach(messages, (message, i) => {
        message.sender = users[i][0];
        message.receiver = users[i][1];
      });

      // send
      res.ok({ messages: messages });

      sails.log("'updatingMessages' :::\n", 'updatingMessages');
      let messageUpdate;
      if (userId === query.where.or[0].receiver) {
        messageUpdate = Message.update({
          sender: query.where.or[0].sender,
          receiver: query.where.or[0].receiver,
          isNew: true
        }, {
          isNew: false
        });
      }
      return messageUpdate;
    })
    .then((updatedMessages) => {
      sails.log("updatedMessages :::\n", updatedMessages);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function findUnique(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Message.findUnique-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  // if (!query.where.sender) {
  //   query.where.sender = req.user.id;
  // }
  //{where: {receiver: req.user.id}, sort: 'id DESC'}
  return Message.find(query)
    .then((preMessages) => {
      sails.log("preMessages :::\n", preMessages);
      let messages = _.uniq(preMessages, 'sender');
      sails.log("messages :::\n", messages);
      let usersPromise = _.map(messages, (message) => {
        return User.findOne({
            id: message.sender
          })
          .populate('profilePhoto');
      });
      return [messages, Promise.all(usersPromise)];
    })
    .spread((messages, users) => {
      _.forEach(messages, (message, i) => {
        message.sender = users[i];
      });
      return messages;
    })
    .then((messages) => {
      return res.ok({
        messages: messages
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

// Associations to Delete
// photos, comments
function destroy(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Review.destroy-- :::\n", queryWrapper);
  var query = queryWrapper.query;

  var id = query.where.id;
  if (!QueryService.checkParamPassed(id)) {
    return res.send(400, { message: "id" });
  }

  return Review.findOne({ id: id })
    .populate('photos')
    .populate('comments')
    .then((review) => {
      if (!review) {
        return Promise.reject({ message: 'no review' });
      }
      let photoIds = _.pluck(review.photos, 'id');
      let photos = ImageService.destoryPhotos(photoIds);

      let commentIds = _.pluck(review.comments, 'id');
      let comments = Comment.destroy({ id: commentIds });

      let reviews = Review.destory({ id: review.id });

      return [reviews, comments, photos];
    })
    .spread((reviews) => {
      let review = reviews[0];
      return res.ok(review);
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}
