/**
 * Created by Andy on 7/6/2015
 * As part of applicatplatform
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 7/6/2015
 *
 */

module.exports = {
  attributes: {

    // Properties
    category: { // FOOD / DRINK
      type: 'STRING'
    },

    name: {
      type: 'STRING'
    },
    price: {
      type: 'STRING'
    },

    place: {
      model: 'Place'
    },
    //====================================================
    //  Not used just incase
    //====================================================
    photos: {
      collection: 'Photo',
      via: 'product'
    },

    reviews: {
      collection: 'Review',
      via: 'product'
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
