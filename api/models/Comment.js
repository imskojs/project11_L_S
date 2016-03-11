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

    content: {
      type: 'STRING'
    },

    isAnnonymous: {
      type: 'BOOLEAN',
      defaultsTo: false
    },

    category: { // POST-COMMENT, REVIEW-COMMENT
      type: 'STRING'
    },

    post: {
      model: 'Post'
    },

    review: {
      model: 'Review'
    },

    //====================================================
    //  Not used just incase
    //====================================================
    children: {
      collection: 'Comment'
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
