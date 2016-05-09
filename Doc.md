//====================================================
//  USER
//====================================================
User.register({}, {password: String, anyProperty}) //POST
=> message = {message: 'registerSuccess'};

User.login({}, {identifier: String(username), password: String}) //POST
=> user = {allProperty: ALL, favorites: [String], roles: [Role]}

User.findOne() -> User

User.update(null, {id: String}) -> User with profilePhoto, photos, roles, favorites[String]
populated.

//====================================================
//  POST
//====================================================
Post.findOne() -> Post w/ owner.profilePhoto, owner.photos populated

Post.find() -> {posts:[Post], more: Number, total: Number}

Post.findFavorite() -> {favorites: [Favorite], posts: [Post]}

Post.destroyCreate(null, {owner, category: '공차'})  // PUT
=> post = {allProperty: ALL} // all previous post is deleted.

Post.destroy({id: String}) -> Post

Post.update(null, {id:String|[String]}) -> {posts: [Post]}

Favorite.destroy({post, owner}) -> {favorites: [String(post.id)]}
Favorite.create(null, {post, owner}) -> {favorites: [String(post.id)]}

Banner.find() -> {banners: [Banner], more: Number, totla: Number}
Banner.findOne() -> Banner

Device.pushOff() -> {devices: [Device]}
Device.pushOn() -> {devices: [Device]}