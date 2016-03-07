/**
 * Created by andy on 27/07/15
 * As part of applicatplatform
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 27/07/15
 *
 */


module.exports = {
  schema: false,
  attributes: {
    post: { model: 'Post' },
    place: { model: 'Place' },
    product: { model: 'Product' },
    comment: { model: 'Comment' },

    owner: { model: 'User' },
    createdBy: { model: 'User' },
    updatedBy: { model: 'User' }
  }
};
