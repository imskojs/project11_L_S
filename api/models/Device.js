/**
 * Created by andy on 26/05/15
 * As part of beigintongserver
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 26/05/15
 *
 */


/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  schema: false,
  attributes: {
    deviceId: {
      unique: true,
      type: 'STRING',
      maxLength: 256,
      required: true,
      notNull: true
    },
    platform: {
      type: 'STRING',
      required: true,
      notNull: true,
      enum: ['IOS', 'ANDROID']
    },
    active: {
      type: 'BOOLEAN',
      defaultsTo: true
    },

    user: {
      model: 'User'
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
