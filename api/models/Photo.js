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
 * News.js

 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


module.exports = {
  schema: false,
  attributes: {

    // Properties
    public_id: {
      type: 'STRING',
      required: true,
      notNull: true
    },
    name: {
      type: 'STRING'
    },
    url: {
      type: 'STRING'
    },
    https: {
      type: 'STRING'
    },
    version: {
      type: 'INTEGER'
    },
    width: {
      type: 'INTEGER'
    },
    height: {
      type: 'INTEGER'
    },
    format: {
      type: 'STRING'
    },
    resource_type: {
      type: 'STRING'
    },
    tags: {
      type: 'ARRAY'
    },

    index: {
      type: 'INTEGER'
    },
    //Associations
    place: {
      model: 'Place'
    },
    post: {
      model: 'Post'
    },
    review: {
      model: 'Review'
    },
    banner: {
      model: 'Banner'
    },
    event: {
      model: 'Event'
    },
    user: {
      model: 'User'
    },
    vehicle: {
      model: 'User'
    },
    //====================================================
    //  Not used, just incase
    //====================================================
    product: {
      model: 'Product'
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
