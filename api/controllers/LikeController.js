'use strict';
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {

  //====================================================
  //  App specific
  //====================================================
  findOne: findOne,
  create: create,
  destroyLikes: destroyLikes,

  //====================================================
  //  Not Used
  //====================================================
  destroy: destroy,
  postLike: postLike,
  postUnlike: postUnlike,
  commentLike: commentLike,
  commentUnlike: commentUnlike,
  placeLike: placeLike,
  placeUnlike: placeUnlike,
  productLike: productLike,
  productUnlike: productUnlike
};

function findOne(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.findOne  -------------");
  sails.log(queryWrapper);

  let query = queryWrapper.query;
  return Like.findOne({
      product: query.where.product,
      owner: query.where.owner || req.user.id
    })
    .then((like) => {
      if (like) {
        return res.ok({
          hasLiked: true
        });
      } else {
        return res.ok({
          hasLiked: false
        });
      }
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function create(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.create  -------------");
  sails.log(queryWrapper);
  let query = queryWrapper.query;
  return Like.findOne({
      product: query.product,
      owner: query.owner || req.user.id
    })
    .then((like) => {
      if (!like) {
        return Like.create({
          product: query.product,
          owner: query.owner
        });
      } else {
        return Promise.reject({
          message: 'already liked by owner'
        });
      }
    })
    .then(() => {
      return Product.findOne({
        id: query.product
      });
    })
    .then((product) => {
      if (!product.like) {
        product.like = 0;
      }
      product.like = product.like + 1;
      let savePending = Promise.pending();
      product.save((err, savedProduct) => {
        if (err) {
          savePending.reject(err);
        } else {
          savePending.resolve(savedProduct);
        }
      });
      return savePending.promise;
    })
    .then(() => {
      return res.ok({
        message: 'like created'
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function destroy(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.destroy  -------------");
  sails.log(queryWrapper);

  let query = queryWrapper.query;
  return Like.findOne({
      id: query.where.id
    })
    .then((like) => {
      if (!like) {
        return Promise.reject({
          message: 'no like to destroy'
        });
      } else {
        return Like.destroy({
          id: like.id
        });
      }
    })
    .then((destroyedLikeInArray) => {
      return Product.findOne({
        id: destroyedLikeInArray[0].product
      });
    })
    .then((product) => {
      if (!product.like) {
        product.like = 0;
      }
      if (product.like < 1) {
        return false;
      }
      product.like = product.like - 1;
      let savePending = Promise.pending();
      product.save((err, savedProduct) => {
        if (err) {
          savePending.reject(err);
        } else {
          savePending.resolve(savedProduct);
        }
      });
      return savePending.promise;
    })
    .then(() => {
      return res.ok({
        message: 'like destroyed'
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}



function destroyLikes(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.destroyLikes  -------------");
  sails.log(queryWrapper);
  let query = queryWrapper.query;
  return Like.findOne({
      product: query.where.product,
      owner: query.where.owner || req.user.id
    })
    .then((like) => {
      if (!like) {
        return Promise.reject({
          message: 'no like to destroy'
        });
      } else {
        return Like.destroy({
          product: like.product,
          owner: query.where.owner || req.user.id
        });
      }
    })
    .then((destroyedLikeInArray) => {
      return Product.findOne({
        id: destroyedLikeInArray[0].product
      });
    })
    .then((product) => {
      if (!product.like) {
        product.like = 0;
      }
      if (product.like < 1) {
        return false;
      }
      product.like = product.like - 1;
      let savePending = Promise.pending();
      product.save((err, savedProduct) => {
        if (err) {
          savePending.reject(err);
        } else {
          savePending.resolve(savedProduct);
        }
      });
      return savePending.promise;
    })
    .then(() => {
      return res.ok({
        message: 'like destroyed'
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}

function postLike(req, res) {

  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.postLike  -------------");
  sails.log(queryWrapper);
  var query = queryWrapper.query;

  var post = query.post;

  var likeToCreate = {
    post: post,
    owner: req.user.id,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  if (!QueryService.checkParamPassed(likeToCreate.post)) {
    return res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
  }

  return Promise.all([Post.findOne({
        post: post
      }),
      Like.find({
        owner: likeToCreate.owner,
        post: likeToCreate.post
      })
    ])
    .spread(function(post, like) {
      if (!post) {
        res.ok({
          message: "존재하지 않는 게시글입니다."
        });
      } else if (like[0]) {
        res.ok({
          message: "이미 좋아요를 하신 게시글입니다."
        });
      } else {
        Promise.all([Post.update({
              id: post.id
            }, {
              likes: ++post.likes
            }),
            Like.create(likeToCreate)
          ])
          .spread(function(posts) {
            if (posts)
              res.send(200, {
                posts: posts
              });
          })
          .catch(function(err) {
            if (err) {
              sails.log.error(err);
              res.send(500, {
                message: "좋아요 하기를 실패 했습니다. 서버에러 code: 001"
              });
            }
          });
      }
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "좋아요 하기를 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}

function postUnlike(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.postUnlike  -------------");
  sails.log(queryWrapper);

  var query = queryWrapper.query;
  var likeToRemove = {
    post: query.post,
    owner: req.user.id
  };

  if (!QueryService.checkParamPassed(likeToRemove.post)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  Promise.all([Post.findOne({
        id: likeToRemove.post
      }),
      Like.find({
        owner: likeToRemove.owner,
        post: likeToRemove.post
      })
    ])
    .spread(function(post, likes) {
      if (!post) {
        res.ok({
          message: "존재하지 않는 게시글입니다."
        });
        return [];
      } else if (!likes[0]) {
        res.ok({
          message: "좋아요 하지 않은 게시글입니다."
        });
        return [];
      } else {
        Promise.all([Post.update({
              id: post.id
            }, {
              likes: --post.likes
            }),
            Like.destroy({
              id: _.pluck(likes, "id")
            })
          ])
          .spread(function(posts) {
            if (posts)
              res.send(200, {
                posts: posts
              });
          })
          .catch(function(err) {
            if (err) {
              sails.log.error(err);
              res.send(500, {
                message: "좋아요 취소 하기를 실패 했습니다. 서버에러 code: 001"
              });
            }
          });
      }
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "좋아요 취소 하기를 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}


function commentLike(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.commentLike  -------------");
  sails.log(queryWrapper);

  var query = queryWrapper.query;
  var comment = query.comment;
  var likeToCreate = {
    comment: query.comment,
    owner: req.user.id,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  if (!QueryService.checkParamPassed(likeToCreate.comment)) {
    return res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
  }


  return Promise.all([Comment.findOne({
        id: comment
      }),
      Like.find({
        owner: likeToCreate.owner,
        comment: likeToCreate.comment
      })
    ])
    .spread(function(comment, like) {
      if (!comment) {
        res.ok({
          message: "존재하지 않는 게시글입니다."
        });
      } else if (like[0]) {
        res.ok({
          message: "이미 좋아요를 하신 게시글입니다."
        });
      } else {
        Promise.all([Comment.update({
              id: comment.id
            }, {
              likes: ++comment.likes
            }),
            Like.create(likeToCreate)
          ])
          .spread(function(comments) {
            if (comments)
              res.send(200, {
                comments: comments
              });
          })
          .catch(function(err) {
            if (err) {
              sails.log.error(err);
              res.send(500, {
                message: "좋아요 하기를 실패 했습니다. 서버에러 code: 001"
              });
            }
          });
      }
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "좋아요 하기를 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}

function commentUnlike(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.commentUnlike  -------------");
  sails.log(queryWrapper);
  var query = queryWrapper.query;

  var likeToRemove = {
    comment: query.comment,
    owner: req.user.id
  };

  sails.log.debug(JSON.stringify(likeToRemove));

  if (!QueryService.checkParamPassed(likeToRemove.comment)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  return Promise.all([Comment.findOne({
        id: likeToRemove.comment
      }),
      Like.find({
        owner: likeToRemove.owner,
        comment: likeToRemove.comment
      })
    ])
    .spread(function(comment, likes) {
      if (!comment) {
        res.ok({
          message: "존재하지 않는 게시글입니다."
        });
        return [];
      } else if (!likes[0]) {
        res.ok({
          message: "좋아요 하지 않은 게시글입니다."
        });
        return [];
      } else {
        Promise.all([Comment.update({
              id: comment.id
            }, {
              likes: --comment.likes
            }),
            Like.destroy({
              id: _.pluck(likes, "id")
            })
          ])
          .spread(function(comments) {
            if (comments)
              res.send(200, {
                comments: comments
              });
          })
          .catch(function(err) {
            if (err) {
              sails.log.error(err);
              res.send(500, {
                message: "좋아요 취소 하기를 실패 했습니다. 서버에러 code: 001"
              });
            }
          });
      }
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "좋아요 취소 하기를 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}


function placeLike(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.placeLike  -------------");
  sails.log(queryWrapper);
  var query = queryWrapper.query;

  var place = query.place;
  var likeToCreate = {
    place: query.place,
    owner: req.user.id,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  if (!QueryService.checkParamPassed(likeToCreate.place)) {
    return res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
  }


  return Promise.all([Place.findOne({
        id: place
      }),
      Like.find({
        owner: likeToCreate.owner,
        place: likeToCreate.place
      })
    ])
    .spread(function(place, like) {
      if (!place) {
        res.ok({
          message: "존재하지 않는 게시글입니다."
        });
      } else if (like[0]) {
        res.ok({
          message: "이미 좋아요를 하신 게시글입니다."
        });
      } else {
        Promise.all([Place.update({
              id: place.id
            }, {
              likes: ++place.likes
            }),
            Like.create(likeToCreate)
          ])
          .spread(function(places) {
            if (places)
              res.send(200, {
                places: places
              });
          })
          .catch(function(err) {
            if (err) {
              sails.log.error(err);
              res.send(500, {
                message: "좋아요 하기를 실패 했습니다. 서버에러 code: 001"
              });
            }
          });
      }
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "좋아요 하기를 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}

function placeUnlike(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.placeUnlike  -------------");
  sails.log(queryWrapper);
  var query = queryWrapper.query;

  var likeToRemove = {
    place: query.place,
    owner: req.user.id
  };

  if (!QueryService.checkParamPassed(likeToRemove.place)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  return Promise.all([Place.findOne({
        id: likeToRemove.place
      }),
      Like.find({
        owner: likeToRemove.owner,
        place: likeToRemove.place
      })
    ])
    .spread(function(place, likes) {
      if (!place) {
        res.ok({
          message: "존재하지 않는 게시글입니다."
        });
        return [];
      } else if (!likes[0]) {
        res.ok({
          message: "좋아요 하지 않은 게시글입니다."
        });
        return [];
      } else {
        Promise.all([Place.update({
              id: place.id
            }, {
              likes: --place.likes
            }),
            Like.destroy({
              id: _.pluck(likes, "id")
            })
          ])
          .spread(function(places) {
            if (places)
              res.send(200, {
                places: places
              });
          })
          .catch(function(err) {
            if (err) {
              sails.log.error(err);
              res.send(500, {
                message: "좋아요 취소 하기를 실패 했습니다. 서버에러 code: 001"
              });
            }
          });
      }
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "좋아요 취소 하기를 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}


function productLike(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.productLike  -------------");
  sails.log(queryWrapper);
  var query = queryWrapper.query;

  var product = query.product;
  var likeToCreate = {
    product: query.product,
    owner: req.user.id,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  if (!QueryService.checkParamPassed(likeToCreate.product)) {
    return res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
  }

  return Promise.all([Product.findOne({
        id: product
      }),
      Like.find({
        owner: likeToCreate.owner,
        product: likeToCreate.product
      })
    ])
    .spread(function(product, like) {
      if (!product) {
        res.ok({
          message: "존재하지 않는 게시글입니다."
        });
      } else if (like[0]) {
        res.ok({
          message: "이미 좋아요를 하신 게시글입니다."
        });
      } else {
        Promise.all([Product.update({
              id: product.id
            }, {
              likes: ++product.likes
            }),
            Like.create(likeToCreate)
          ])
          .spread(function(products) {
            if (products)
              res.send(200, {
                products: products
              });
          })
          .catch(function(err) {
            if (err) {
              sails.log.error(err);
              res.send(500, {
                message: "좋아요 하기를 실패 했습니다. 서버에러 code: 001"
              });
            }
          });
      }
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "좋아요 하기를 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}

function productUnlike(req, res) {
  var queryWrapper = QueryService.buildQuery(req);
  sails.log("-----------  queryWrapper: Like.productUnlike  -------------");
  sails.log(queryWrapper);
  var query = queryWrapper.query;

  var likeToRemove = {
    product: query.product,
    owner: req.user.id
  };

  if (!QueryService.checkParamPassed(likeToRemove.product)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  return Promise.all([Product.findOne({
        id: likeToRemove.product
      }),
      Like.find({
        owner: likeToRemove.owner,
        product: likeToRemove.product
      })
    ])
    .spread(function(product, likes) {
      if (!product) {
        res.ok({
          message: "존재하지 않는 게시글입니다."
        });
        return [];
      } else if (!likes[0]) {
        res.ok({
          message: "좋아요 하지 않은 게시글입니다."
        });
        return [];
      } else {
        Promise.all([Product.update({
              id: product.id
            }, {
              likes: --product.likes
            }),
            Like.destroy({
              id: _.pluck(likes, "id")
            })
          ])
          .spread(function(products) {
            if (products)
              res.send(200, {
                products: products
              });
          })
          .catch(function(err) {
            if (err) {
              sails.log.error(err);
              res.send(500, {
                message: "좋아요 취소 하기를 실패 했습니다. 서버에러 code: 001"
              });
            }
          });
      }
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "좋아요 취소 하기를 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}
