module.exports.routes = {

  '/': {
    assets: 'index.html'
  },
  //====================================================
  //  User
  //====================================================
  'POST /user/login': 'AuthController.login',
  'POST /user/register': 'AuthController.register',
  'GET /user/findOne': 'UserController.findOne',
  'PUT /user/update': 'UserController.update',
  // admin
  'GET /user/find': 'UserController.find',
  //====================================================
  //  Post
  //====================================================
  'GET /post/findOne': 'PostController.findOne',
  'GET /post/find': 'PostController.find',
  'GET /post/findFavorite': 'PostController.findFavorite',
  'PUT /post/destroyCreate': 'PostController.destroyCreate',
  'DELETE /post/destroy': 'PostController.destroy',
  'PUT /post/update': 'PostController.update',
  // admin
  'POST /post/create': 'PostController.create',
  //====================================================
  //  Favorite
  //====================================================
  'POST /favorite/create': 'FavoriteController.create',
  'DELETE /favorite/destroy': 'FavoriteController.destroy',
  // 'POST /favorite/find': 'FavoriteController.find',
  // 'POST /favorite/createPlace': 'FavoriteController.createPlace',
  //====================================================
  //  Banner
  //====================================================
  'GET /banner/find': 'BannerController.find',
  'GET /banner/findOne': 'BannerController.findOne',
  // admin
  'POST /banner/create': 'BannerController.create',
  'PUT /banner/update': 'BannerController.update',
  'DELETE /banner/destroy': 'BannerController.destroy',
  // 'GET /banner/findFive': 'BannerController.findFive',
  //====================================================
  //  Photo
  //====================================================
  'PUT /photo/upsertPhotos': 'PhotoController.upsertPhotos',
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
  // 'GET /user/checkNickname': 'AuthController.checkNickname',
  // 'GET /user/checkUsername': 'AuthController.checkUsername',
  // 'GET /user/checkEmail': 'AuthController.checkEmail',

  'GET /user/logout': 'AuthController.logout',

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
  'GET /user/findNative': 'UserController.findNative',
  // User authentication service
  // 'GET /user/find': 'UserController.find',
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
