/* jshint ignore:start */
'use strict';
/* jshint ignore:end */
let all = [
    'basicAuth', 'bearerAuth', 'passportBearerAuth', 'passport', 'sessionAuth',
    'ModelPolicy', 'AuditPolicy', 'OwnerPolicy', 'PermissionPolicy', 'RolePolicy',
    'CriteriaPolicy'
];

module.exports.policies = {
  '*': all,
  //====================================================
  //  Banner
  //====================================================
  BannerController: {
    findFive: true,
  },

  PlaceController: {
    find: true,
    findNative: true,
    findOne: true,
  },

  ReviewController: {
    find: true,
    findOne: true,
  },
  // FavoriteController: {}
  ProductController: {
    find: true,
    findOne: true
  },

  CommentController: {
    find: true,
    findOne: true
  },

  PostController: {
    find: true,
    findOne: true
  },
  // PhotoController:{}
  AuthController: {
    '*': ['passport'],
    'contactAdmin': true,
    'changePassword': [
      'bearerAuth',
      'sessionAuth'
    ]
  },
  // UserController: {}
  EventController: {
    find: true,
    findOne: true
  },

  DeviceController: {
    register: true,
  },

  DataController: [
    'BearerAdmin',
    'sessionAuth'
  ],

  UserController: {
    findOne: true,
    contactAdmin: true,
    ask: true,
    sendEmail: true
  }
};
