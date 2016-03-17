/* beautify preserve:start */


module.exports.users = {

  roles: [
    {
      name: 'ADMIN'
    },
    {
      name: 'OWNER'
    },
    {
      name: 'USER'
    }
  ],

  permissions: {
    ADMIN: [
      // Model
      {"name": 'ADMIN 모델 읽기', "model": 'Model', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 모델 만들기', "model": 'Model', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 모델 수정', "model": 'Model', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 모델 지우기', "model": 'Model', "action": 'delete', "relation": 'role'},

      // Role
      {"name": 'ADMIN 역할 읽기', "model": 'Role', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 역할 만들기', "model": 'Role', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 역할 수정', "model": 'Role', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 역할 지우기', "model": 'Role', "action": 'delete', "relation": 'role'},

      // Permission
      {"name": 'ADMIN 권한 읽기', "model": 'Permission', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 권한 만들기', "model": 'Permission', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 권한 수정', "model": 'Permission', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 권한 지우기', "model": 'Permission', "action": 'delete', "relation": 'role'},

      // Criteria
      {"name": 'ADMIN 기준 읽기', "model": 'Criteria', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 기준 만들기', "model": 'Criteria', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 기준 수정', "model": 'Criteria', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 기준 지우기', "model": 'Criteria', "action": 'delete', "relation": 'role'},

      // User
      {"name": 'ADMIN 사용자 읽기', "model": 'User', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 사용자 쓰기', "model": 'User', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 사용자 수정', "model": 'User', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 사용자 지우기', "model": 'User', "action": 'delete', "relation": 'role'},

      // Photo
      {"name": 'ADMIN 사진 읽기', "model": 'Photo', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 사진 쓰기', "model": 'Photo', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 사진 수정', "model": 'Photo', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 사진 지우기', "model": 'Photo', "action": 'delete', "relation": 'role'},

      // Post
      {"name": 'ADMIN 글 읽기', "model": 'Post', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 글 쓰기', "model": 'Post', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 글 수정', "model": 'Post', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 글 지우기', "model": 'Post', "action": 'delete', "relation": 'role'},

      // Comment
      {"name": 'ADMIN 댓글 읽기', "model": 'Comment', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 댓글 쓰기', "model": 'Comment', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 댓글 수정', "model": 'Comment', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 댓글 지우기', "model": 'Comment', "action": 'delete', "relation": 'role'},

      // Place
      {"name": 'ADMIN 장소 읽기', "model": 'Place', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 장소 만들기', "model": 'Place', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 장소 수정', "model": 'Place', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 장소 지우기', "model": 'Place', "action": 'delete', "relation": 'role'},

      // Product
      {"name": 'ADMIN 상품 읽기', "model": 'Product', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 상품 만들기', "model": 'Product', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 상품 수정', "model": 'Product', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 상품 지우기', "model": 'Product', "action": 'delete', "relation": 'role'},

      // Review
      {"name": 'ADMIN 리뷰 읽기', "model": 'Review', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 리뷰 만들기', "model": 'Review', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 리뷰 수정', "model": 'Review', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 리뷰 지우기', "model": 'Review', "action": 'delete', "relation": 'role'},

      // Device
      {"name": 'ADMIN 기기 읽기', "model": 'Device', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 기기 만들기', "model": 'Device', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 기기 수정', "model": 'Device', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 기기 지우기', "model": 'Device', "action": 'delete', "relation": 'role'},

      // Message 
      {"name": 'ADMIN 쪽지 읽기', "model": 'Message', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 쪽지 만들기', "model": 'Message', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 쪽지 수정', "model": 'Message', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 쪽지 지우기', "model": 'Message', "action": 'delete', "relation": 'role'},

      // Event 
      {"name": 'ADMIN 이벤트 읽기', "model": 'Event', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 이벤트 만들기', "model": 'Event', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 이벤트 수정', "model": 'Event', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 이벤트 지우기', "model": 'Event', "action": 'delete', "relation": 'role'},

      // Banner 
      {"name": 'ADMIN 광고 읽기', "model": 'Banner', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 광고 만들기', "model": 'Banner', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 광고 수정', "model": 'Banner', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 광고 지우기', "model": 'Banner', "action": 'delete', "relation": 'role'},

      // Favorite 
      {"name": 'ADMIN 즐겨찾기 읽기', "model": 'Favorite', "action": 'read', "relation": 'role'},
      {"name": 'ADMIN 즐겨찾기 만들기', "model": 'Favorite', "action": 'create', "relation": 'role'},
      {"name": 'ADMIN 즐겨찾기 수정', "model": 'Favorite', "action": 'update', "relation": 'role'},
      {"name": 'ADMIN 즐겨찾기 지우기', "model": 'Favorite', "action": 'delete', "relation": 'role'},
    ],
    OWNER: [
      // Model
      {"name": 'OWNER 모델 읽기', "model": 'Model', "action": 'read', "relation": 'role'},

      // Role
      {"name": 'OWNER 역할 읽기', "model": 'Role', "action": 'read', "relation": 'role'},

      // Permission
      {"name": 'OWNER 권한 읽기', "model": 'Permission', "action": 'read', "relation": 'role'},

      // Criteria
      {"name": 'OWNER 기준 읽기', "model": 'Criteria', "action": 'read', "relation": 'role'},

      // User
      {"name": 'OWNER 사용자 읽기', "model": 'User', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 사용자 수정', "model": 'User', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 사용자 지우기', "model": 'User', "action": 'delete', "relation": 'owner'},

      // Photo
      {"name": 'OWNER 사진 읽기', "model": 'Photo', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 사진 쓰기', "model": 'Photo', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 사진 수정', "model": 'Photo', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 사진 지우기', "model": 'Photo', "action": 'delete', "relation": 'owner'},

      // Post
      {"name": 'OWNER 글 읽기', "model": 'Post', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 글 쓰기', "model": 'Post', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 글 수정', "model": 'Post', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 글 지우기', "model": 'Post', "action": 'delete', "relation": 'owner'},

      // Comment
      {"name": 'OWNER 댓글 읽기', "model": 'Comment', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 댓글 쓰기', "model": 'Comment', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 댓글 수정', "model": 'Comment', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 댓글 지우기', "model": 'Comment', "action": 'delete', "relation": 'owner'},

      // Place
      {"name": 'OWNER 장소 읽기', "model": 'Place', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 장소 만들기', "model": 'Place', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 장소 수정', "model": 'Place', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 장소 지우기', "model": 'Place', "action": 'delete', "relation": 'owner'},

      // Product
      {"name": 'OWNER 상품 읽기', "model": 'Product', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 상품 만들기', "model": 'Product', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 상품 수정', "model": 'Product', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 상품 지우기', "model": 'Product', "action": 'delete', "relation": 'owner'},

      // Review
      {"name": 'OWNER 리뷰 읽기', "model": 'Review', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 리뷰 만들기', "model": 'Review', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 리뷰 수정', "model": 'Review', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 리뷰 지우기', "model": 'Review', "action": 'delete', "relation": 'owner'},

      // Device
      {"name": 'OWNER 기기 읽기', "model": 'Device', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 기기 만들기', "model": 'Device', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 기기 수정', "model": 'Device', "action": 'update', "relation": 'role'},
      {"name": 'OWNER 기기 지우기', "model": 'Device', "action": 'delete', "relation": 'owner'},

      // Message 
      {"name": 'OWNER 쪽지 읽기', "model": 'Message', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 쪽지 만들기', "model": 'Message', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 쪽지 수정', "model": 'Message', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 쪽지 지우기', "model": 'Message', "action": 'delete', "relation": 'owner'},

      // Event 
      {"name": 'OWNER 이벤트 읽기', "model": 'Event', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 이벤트 만들기', "model": 'Event', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 이벤트 수정', "model": 'Event', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 이벤트 지우기', "model": 'Event', "action": 'delete', "relation": 'owner'},

      // Banner 
      {"name": 'OWNER 광고 읽기', "model": 'Banner', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 광고 만들기', "model": 'Banner', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 광고 수정', "model": 'Banner', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 광고 지우기', "model": 'Banner', "action": 'delete', "relation": 'owner'},

      // Favorite 
      {"name": 'OWNER 즐겨찾기 읽기', "model": 'Favorite', "action": 'read', "relation": 'role'},
      {"name": 'OWNER 즐겨찾기 만들기', "model": 'Favorite', "action": 'create', "relation": 'role'},
      {"name": 'OWNER 즐겨찾기 수정', "model": 'Favorite', "action": 'update', "relation": 'owner'},
      {"name": 'OWNER 즐겨찾기 지우기', "model": 'Favorite', "action": 'delete', "relation": 'owner'},

    ],
    USER: [
      // Model
      {"name": 'USER 모델 읽기', "model": 'Model', "action": 'read', "relation": 'role'},

      // Role
      {"name": 'USER 역할 읽기', "model": 'Role', "action": 'read', "relation": 'role'},

      // Permission
      {"name": 'USER 권한 읽기', "model": 'Permission', "action": 'read', "relation": 'role'},

      // Criteria
      {"name": 'USER 기준 읽기', "model": 'Criteria', "action": 'read', "relation": 'role'},

      // User
      {"name": 'USER 사용자 읽기', "model": 'User', "action": 'read', "relation": 'role'},
      {"name": 'USER 사용자 수정', "model": 'User', "action": 'update', "relation": 'owner'},
      {"name": 'USER 사용자 지우기', "model": 'User', "action": 'delete', "relation": 'owner'},

      // Photo
      {"name": 'USER 사진 읽기', "model": 'Photo', "action": 'read', "relation": 'role'},
      {"name": 'USER 사진 쓰기', "model": 'Photo', "action": 'create', "relation": 'role'},
      {"name": 'USER 사진 수정', "model": 'Photo', "action": 'update', "relation": 'role'},
      {"name": 'USER 사진 지우기', "model": 'Photo', "action": 'delete', "relation": 'owner'},

      // Post
      {"name": 'USER 글 읽기', "model": 'Post', "action": 'read', "relation": 'role'},
      {"name": 'USER 글 쓰기', "model": 'Post', "action": 'create', "relation": 'role'},
      {"name": 'USER 글 수정', "model": 'Post', "action": 'update', "relation": 'owner'},
      {"name": 'USER 글 지우기', "model": 'Post', "action": 'delete', "relation": 'owner'},

      // Comment
      {"name": 'USER 댓글 읽기', "model": 'Comment', "action": 'read', "relation": 'role'},
      {"name": 'USER 댓글 쓰기', "model": 'Comment', "action": 'create', "relation": 'role'},
      {"name": 'USER 댓글 수정', "model": 'Comment', "action": 'update', "relation": 'owner'},
      {"name": 'USER 댓글 지우기', "model": 'Comment', "action": 'delete', "relation": 'owner'},

      // Like
      {"name": 'USER 좋아요 읽기', "model": 'Like', "action": 'read', "relation": 'role'},
      {"name": 'USER 좋아요 만들기', "model": 'Like', "action": 'create', "relation": 'role'},
      {"name": 'USER 좋아요 수정', "model": 'Like', "action": 'update', "relation": 'owner'},
      {"name": 'USER 좋아요 지우기', "model": 'Like', "action": 'delete', "relation": 'owner'},

      // Place
      {"name": 'USER 장소 읽기', "model": 'Place', "action": 'read', "relation": 'role'},
      // {"name": 'USER 장소 만들기', "model": 'Place', "action": 'create', "relation": 'role'},
      {"name": 'USER 장소 수정', "model": 'Place', "action": 'update', "relation": 'owner'},
      {"name": 'USER 장소 지우기', "model": 'Place', "action": 'delete', "relation": 'owner'},

      // Product
      {"name": 'USER 상품 읽기', "model": 'Product', "action": 'read', "relation": 'role'},
      //{"name": 'USER 상품 만들기', "model": 'Product', "action": 'create', "relation": 'role'},
      {"name": 'USER 상품 수정', "model": 'Product', "action": 'update', "relation": 'owner'},
      {"name": 'USER 상품 지우기', "model": 'Product', "action": 'delete', "relation": 'owner'},

      // Review
      {"name": 'USER 리뷰 읽기', "model": 'Review', "action": 'read', "relation": 'role'},
      {"name": 'USER 리뷰 만들기', "model": 'Review', "action": 'create', "relation": 'role'},
      {"name": 'USER 리뷰 수정', "model": 'Review', "action": 'update', "relation": 'owner'},
      {"name": 'USER 리뷰 지우기', "model": 'Review', "action": 'delete', "relation": 'owner'},

      // Message 
      {"name": 'USER 쪽지 읽기', "model": 'Message', "action": 'read', "relation": 'role'},
      {"name": 'USER 쪽지 만들기', "model": 'Message', "action": 'create', "relation": 'role'},
      {"name": 'USER 쪽지 수정', "model": 'Message', "action": 'update', "relation": 'owner'},
      {"name": 'USER 쪽지 지우기', "model": 'Message', "action": 'delete', "relation": 'owner'},

      // Event 
      {"name": 'USER 이벤트 읽기', "model": 'Event', "action": 'read', "relation": 'role'},
      {"name": 'USER 이벤트 만들기', "model": 'Event', "action": 'create', "relation": 'role'},
      {"name": 'USER 이벤트 수정', "model": 'Event', "action": 'update', "relation": 'owner'},
      {"name": 'USER 이벤트 지우기', "model": 'Event', "action": 'delete', "relation": 'owner'},

      // Device
      {"name": 'USER 기기 읽기', "model": 'Device', "action": 'read', "relation": 'role'},
      {"name": 'USER 기기 만들기', "model": 'Device', "action": 'create', "relation": 'role'},
      {"name": 'USER 기기 수정', "model": 'Device', "action": 'update', "relation": 'role'},
      {"name": 'USER 기기 지우기', "model": 'Device', "action": 'delete', "relation": 'owner'},

      // Banner 
      {"name": 'USER 광고 읽기', "model": 'Banner', "action": 'read', "relation": 'role'},
      {"name": 'USER 광고 만들기', "model": 'Banner', "action": 'create', "relation": 'role'},
      {"name": 'USER 광고 수정', "model": 'Banner', "action": 'update', "relation": 'owner'},
      {"name": 'USER 광고 지우기', "model": 'Banner', "action": 'delete', "relation": 'owner'},

      // Favorite 
      {"name": 'USER 즐겨찾기 읽기', "model": 'Favorite', "action": 'read', "relation": 'role'},
      {"name": 'USER 즐겨찾기 만들기', "model": 'Favorite', "action": 'create', "relation": 'role'},
      {"name": 'USER 즐겨찾기 수정', "model": 'Favorite', "action": 'update', "relation": 'owner'},
      {"name": 'USER 즐겨찾기 지우기', "model": 'Favorite', "action": 'delete', "relation": 'owner'},
    ]
  },

  initialUser: {
    ADMIN: [
      {
        email: 'developer@applicat.co.kr',
        username: 'admin',
        nickname: '관리자',
        password: 'admin1234'
      }
    ],
    OWNER: [
      {
        email: 'owner@applicat.co.kr',
        username: 'owner',
        nickname: '주인',
        password: 'owner1234'
      }
    ],
    USER: [
      {
        email: 'user@applicat.co.kr',
        username: 'user',
        nickname: '사용자',
        password: 'user1234'
      }
    ],
  },

  /*      DANGER      */
  drop: false
};



/* beautify preserve:end */
