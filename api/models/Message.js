/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    sender: {
      model: 'User',
      index: true
    },
    receiver: {
      model: 'User',
      index: true
    },
    content: {
      type: 'STRING'
    },
    isNew: {
      type: 'BOOLEAN',
      defaultsTo: true
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

  }
};
