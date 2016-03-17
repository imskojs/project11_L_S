module.exports.routes = {
  '/': {
    assets: 'index.html'
  },
  '/admin': {
    assets: 'admin.html'
  },
  //====================================================
  //  Banner
  //====================================================
  'POST /banner/create': 'BannerController.create',
  'GET /banner/find': 'BannerController.find',
  'GET /banner/findFive': 'BannerController.findFive',
  'GET /banner/findOne': 'BannerController.findOne',
  'PUT /banner/update': 'BannerController.update',
  'DELETE /banner/destroy': 'BannerController.destroy',
  //====================================================
  //  Place
  //====================================================
  'POST /place/create': 'PlaceController.create',
  'GET /place/find': 'PlaceController.find',
  'GET /place/findNative': 'PlaceController.findNative',
  'GET /place/findOne': 'PlaceController.findOne',
  'PUT /place/update': 'PlaceController.update',
  'DELETE /place/destroy': 'PlaceController.destroy',
  'PUT /place/updateProducts': 'PlaceController.updateProducts',
  //====================================================
  //  Review
  //====================================================
  'POST /review/createReview': 'ReviewController.createReview',
  'GET /review/find': 'ReviewController.find', // admin
  // 'GET /review/findReview': 'ReviewController.findReview', // client 
  'GET /review/findOne': 'ReviewController.findOne',
  'PUT /review/updateReview': 'ReviewController.updateReview',
  'DELETE /review/destroyReview': 'ReviewController.destroyReview',
  // probably not used
  // 'POST /review/create': 'ReviewController.create',
  //====================================================
  //  Favorite
  //====================================================
  'POST /favorite/find': 'FavoriteController.find',
  'POST /favorite/createPlace': 'FavoriteController.createPlace',
  'DELETE /favorite/destroy': 'FavoriteController.destroy',
  //====================================================
  //  Message
  //====================================================
  'POST /message/create': 'MessageController.create',
  'GET /message/find': 'MessageController.find',
  'GET /message/findUnique': 'MessageController.findUnique',
  'DELETE /message/destroy': 'MessageController.destroy',
  //====================================================
  //  Product
  //====================================================
  'POST /product/create': 'ProductController.create',
  'GET /product/find': 'ProductController.find',
  'GET /product/findOne': 'ProductController.findOne',
  'PUT /product/update': 'ProductController.update',
  'DELETE /product/destroy': 'ProductController.destroy',
  //====================================================
  //  Comment
  //====================================================
  'POST /comment/createComment': 'CommentController.createComment',
  'GET /comment/find': 'CommentController.find',
  'GET /comment/findOne': 'CommentController.findOne',
  'PUT /comment/updateComment': 'CommentController.updateComment',
  'DELETE /comment/destroyComment': 'CommentController.destroyComment',
  //====================================================
  //  Post
  //====================================================
  'POST /post/create': 'PostController.create',
  'GET /post/find': 'PostController.find',
  'GET /post/findOne': 'PostController.findOne',
  'PUT /post/update': 'PostController.update',
  'DELETE /post/destroy': 'PostController.destroy',
  //====================================================
  //  Photo
  //====================================================
  'POST /photo/createPhotos': 'PhotoController.createPhotos',
  'PUT /photo/updatePhotos': 'PhotoController.updatePhotos',
  //====================================================
  //  User
  //====================================================
  'POST /user/login': 'AuthController.login',
  'POST /user/loginWithOauth': 'AuthController.registerPassport',
  'GET /user/find': 'UserController.find',
  'GET /user/findOne': 'UserController.findOne',
  'PUT /user/update': 'UserController.update',
  'POST /email/admin': 'UserController.contactAdmin',
  'POST /email/ask': 'UserController.ask',
  'POST /user/sendEmail': 'UserController.sendEmail',
  //====================================================
  //  Event
  //====================================================
  'POST /event/create': 'EventController.create',
  'GET /event/find': 'EventController.find',
  'GET /event/findOne': 'EventController.findOne',
  'PUT /event/update': 'EventController.update',
  'DELETE /event/destroy': 'EventController.destroy',
  //====================================================
  //  Device
  //====================================================
  'POST /device/register': 'DeviceController.register',
  'GET /device/pushAll': 'DeviceController.pushAll',
  'PUT /device/update': 'DeviceController.update',
  'PUT /device/pushOn': 'DeviceController.pushOn',
  'PUT /device/pushOff': 'DeviceController.pushOff',

  /**************************************
   *               Auth
   *************************************/
  // OAuth
  'GET /user/checkNickname': 'AuthController.checkNickname',
  'GET /user/checkUsername': 'AuthController.checkUsername',
  'GET /user/checkEmail': 'AuthController.checkEmail',

  'GET /user/logout': 'AuthController.logout',

  'POST /user/register': 'AuthController.register',
  // 'POST /user/loginWithOauth': 'AuthController.registerPassport',

  'POST /forgotpassword': 'AuthController.forgotPasswordStart',
  'POST /forgotpassword/check': 'AuthController.forgotPasswordCheck',
  'PUT /forgotpassword/complete': 'AuthController.forgotPasswordComplete',
  'PUT /auth/changePassword': 'AuthController.changePassword',

  /**************************************
   *               User
   *************************************/
  'GET /me': 'UserController.getMyUserInfo',
  'PUT /me': 'UserController.updateMyInfo',

  // User authentication service
  // 'GET /user/find': 'UserController.find',
  'GET /user/findNative': 'UserController.findNative',
  // 'GET /user/findOne': 'UserController.findOne',

  'POST /user/create': 'UserController.create',
  // 'PUT /user/update': 'UserController.update',
  'DELETE /user/destroy': 'UserController.destroy',




  /**************************************
   *               Role
   *************************************/

  'GET /role/myrole': 'RoleController.getMyRole',

  'GET /role/find': 'RoleController.find',
  'GET /role/findNative': 'RoleController.findNative',
  'GET /role/findOne': 'RoleController.findOne',

  'POST /role/create': 'RoleController.create',
  'PUT /role/update': 'RoleController.update',
  'DELETE /role/destroy': 'RoleController.destroy',

  /**************************************
   *               Socket
   *************************************/

  'GET /subscribeToRoom/:roomName': 'SocketController.subscribeToRoom',

  /**************************************
   *               Data
   *************************************/

  'POST /data/import': 'DataController.importCollection',
  'GET /data/export': 'DataController.exportCollection'

};
