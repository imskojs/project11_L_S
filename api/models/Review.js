//====================================================
//  Touched by Ko 2.16
//====================================================
module.exports = {
  attributes: {

    rating: {
      type: 'INTEGER',
      defaultsTo: 5
    },

    content: {
      type: 'STRING'
    },

    viewCount: {
      type: 'INTEGER',
      defaultsTo: 0
    },

    photos: {
      collection: 'Photo',
      via: 'review'
    },

    place: {
      model: 'Place'
    },

    comments: {
      collection: 'Comment',
      via: 'review'
    },

    //====================================================
    //  Not used
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
