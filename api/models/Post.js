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

module.exports = {
  attributes: {

    title: {
      type: 'STRING'
    },

    category: { // '자유톡', '연애톡', '번개톡', '유머톡', 'NOTICE', 'FAQ'
      type: 'STRING'
    },

    showInTalk: {
      type: 'BOOLEAN',
      defaultsTo: false
    },

    content: {
      type: 'STRING'
    },

    commentCount: {
      type: 'INTEGER',
      defaultsTo: 0
    },

    comments: {
      collection: 'Comment',
      via: 'post'
    },

    photos: {
      collection: 'Photo',
      via: 'post'
    },

    //====================================================
    //  Not used
    //====================================================
    place: {
      model: 'Place'
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
