var user;
user = {
  //====================================================
  //  Common
  //====================================================
  username: {
    type: 'String'
  },
  name: {
    type: 'String'
  },
  mobilePhone: {
    type: 'String'
  },
  profilePhoto: {
    model: 'Photo'
  },
  roles: { // [DRIVER], [USER]
    colelction: 'Role',
    via: 'user'
  },
  //====================================================
  //  User
  //====================================================
  phone: {  //optional
    type: 'String' 
  },
  email: {
    type: 'String'
  },
  userType: { // '개인', '사업자', '주선사업자'
    type: 'String'
  },
  favorites: {
    collection: 'Favorite',
    via: 'owner'
  },
  //====================================================
  //  Driver
  //====================================================
  vehicleWeight: {
    type: 'String'
  },
  vehicleType: {
    type: 'String'
  },
  maxLoadable: {
    type: 'String'
  },
  vehicleNumber: {
    type: 'String'
  },
  driverSummary: { //optional
    type: 'String'
  },
  // Association
  photos: { // optional
    collection: 'Photo',
    via: 'vehicle'
  },
};