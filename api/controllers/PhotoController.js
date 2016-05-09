/* globals ImageService, QueryService */
/* globals Photo */
'use strict'; // jshint ignore:line
var Promise = require('bluebird'); // jshint ignore:line

var _ = require('lodash');

module.exports = {
  upsertPhotos: upsertPhotos,
  //====================================================
  //  Not used
  //====================================================
  // find: find,
  // findOne: findOne,
  // update: update,
  // destroy: destroy
  // createPhotos: createPhotos,
  // updatePhotos: updatePhotos,
};


function upsertPhotos(req, res) {
  let queryWrapper = QueryService.buildQuery(req);
  sails.log("queryWrapper --Photo.upsertPhotos-- :::\n", queryWrapper);
  let query = queryWrapper.query;
  // let query = { 
  //   destroy: iPhoto.id[], 
  //   create: Object[], // data to create to photos with req.files array eg {index: 1}
  //   // update is used to change non-cloudinary properties only
  //   update: { // need to send already existing photos 'iPhoto.id': {index: number}
  //     'iPhoto.id': Object,
  //     ...
  //     'iPhoto.id': Object
  //   }
  // }
  let destroy = query.destroy;
  let create = query.create;
  let update = query.update;
  return ImageService.destroyPhotos(destroy)
    .then((destroyedPhotoids) => {
      sails.log("destroyedPhotoids --Photo.updatePhotos-- :::\n", destroyedPhotoids);
      let updatedPhotos = _.map(update, (updateObj, photoId) => {
        return Photo.update({ id: photoId }, updateObj)
          .then((photos) => {
            return photos[0];
          });
      });
      return Promise.all(updatedPhotos);
    })
    .then((updatedPhotos) => {
      sails.log("updatedPhotos --Photo.updatePhotos-- :::\n", updatedPhotos);
      return [updatedPhotos, ImageService.createPhotos(req, ['LOGISTICS'], create)];
    })
    .spread((updatedPhotos, createdPhotos) => {
      let photos = updatedPhotos.concat(createdPhotos);
      let photoIds = _.pluck(photos, 'id');
      return res.ok({
        ids: photoIds
      });
    })
    .catch((err) => {
      return res.negotiate(err);
    });
}


// function find(req, res) {
//   var queryWrapper = QueryService.buildQuery(req);
//   sails.log("-----------  queryWrapper: Photo.find  -------------");
//   sails.log(queryWrapper);
//   var query = queryWrapper.query;

//   var populate = queryWrapper.populate;

//   if (!query.limit || query.limit > 100)
//     query.limit = 100;

//   query.limit++;

//   var photoPromise = Photo.find(query);

//   QueryService.applyPopulate(photoPromise, populate);

//   var countPromise = Photo.count(query);

//   return Promise.all([photoPromise, countPromise])
//     .spread(function(photos, count) {
//       var more = (photos[query.limit - 1]) ? true : false;
//       if (more) photos.splice(query.limit - 1, 1);
//       return res.ok({
//         photos: photos,
//         more: more,
//         total: count
//       });
//     })
//     .catch(function(err) {
//       sails.log.error(err);
//       return res.send(500, {
//         message: "장소 로딩을 실패 했습니다. 서버에러 code: 001"
//       });
//     });
// }


// function findOne(req, res) {
//   var queryWrapper = QueryService.buildQuery(req);
//   sails.log("-----------  queryWrapper: Photo.findOne  -------------");
//   sails.log(queryWrapper);
//   var query = queryWrapper.query;
//   var populate = queryWrapper.populate;

//   if (!QueryService.checkParamPassed(query.where.id)) {
//     return res.send(400, {
//       message: "모든 매개 변수를 입력해주세요 code: 003"
//     });
//   }

//   var photoPromise = Photo.find(query);

//   QueryService.applyPopulate(photoPromise, populate);

//   return photoPromise
//     .then(function(photo) {
//       if (photo && photo[0]) {
//         res.send(200, {
//           photo: photo[0]
//         });
//       } else {
//         res.send(500, {
//           message: "존재하지 않는 게시글 입니다. 서버에러 code: 001"
//         });
//       }
//     })
//     .catch(function(err) {
//       sails.log.error(err);
//       res.send(500, {
//         message: "게시물 로딩을 실패 했습니다. 서버에러 code: 001"
//       });
//     });
// }



// function update(req, res) {
//   var queryWrapper = QueryService.buildQuery(req);
//   sails.log("-----------  queryWrapper: Photo.update  -------------");
//   sails.log(queryWrapper);
//   var photo = queryWrapper.query;
//   var id = photo.id;
//   delete photo.createdBy;
//   delete photo.id;

//   if (!QueryService.checkParamPassed(id)) {
//     return res.send(400, {
//       message: "모든 매개 변수를 입력해주세요 code: 003"
//     });
//   }

//   return ImageService.uploadPhoto(req, [], photo, function(err, images) {

//     if (err) {
//       sails.log.error(err);
//       res.send(500, {
//         message: "게시물 로딩을 실패 했습니다. 서버에러 code: 004"
//       });
//       return;
//     }

//     if (images[0]) {
//       photo = _.extend(photo, images[0]);
//     }

//     sails.log(photo);

//     return Photo.update({
//         id: id
//       }, photo)
//       .then(function(updatedPhoto) {
//         return res.send(200, updatedPhoto);
//       })
//       .catch(function() {
//         return res.send(500, {
//           message: "Failed to update code: 001"
//         });
//       });
//   });
// }


// function destroy(req, res) {
//   var queryWrapper = QueryService.buildQuery(req);
//   sails.log("-----------  queryWrapper: Photo.destroy  -------------");
//   sails.log(queryWrapper);
//   var query = queryWrapper.query;

//   var id = query.where.id;

//   if (!QueryService.checkParamPassed(id)) {
//     return res.send(400, {
//       message: "모든 매개 변수를 입력해주세요 code: 003"
//     });
//   }

//   return ImageService.deletePhoto(id, function(err, photos) {
//     if (err) {
//       return res.send(500, {
//         message: "게시물 로딩을 실패 했습니다. 서버에러 code: 004"
//       });
//     }
//     return res.send(200, photos);
//   });
// }
// function createPhotos(req, res) {
//   let queryWrapper = QueryService.buildQuery(req);
//   sails.log("queryWrapper --Photo.createPhotos-- :::\n", queryWrapper);
//   let query = queryWrapper.query;
//   // let query = { 
//   //   destroy: iPhoto.id[], 
//   //   create: Object[],
//   //   update: {
//   //     'iPhoto.id': Object,
//   //     ...
//   //     'iPhoto.id': Object
//   //   }
//   // }
//   return ImageService.createPhotos(req, ['JOODANG'], query.create)
//     .then((createdPhotos) => {
//       sails.log("createdPhotos :::\n", createdPhotos);
//       let photoIds = _.pluck(createdPhotos, 'id');
//       return res.ok({
//         ids: photoIds
//       });
//     })
//     .catch((err) => {
//       return res.negotiate(err);
//     });
// }

// function updatePhotos(req, res) {
//   let queryWrapper = QueryService.buildQuery(req);
//   sails.log("queryWrapper --Photo.updatePhotos-- :::\n", queryWrapper);
//   let query = queryWrapper.query;
//   // let query = { 
//   //   destroy: iPhoto.id[], 
//   //   create: Object[], // data to create to photos with req.files array eg {index: 1}
//   //   // update is used to change non-cloudinary properties only
//   //   update: { // need to send already existing photos 'iPhoto.id': {index: number}
//   //     'iPhoto.id': Object,
//   //     ...
//   //     'iPhoto.id': Object
//   //   }
//   // }
//   let destroy = query.destroy;
//   let create = query.create;
//   let update = query.update;
//   return ImageService.destroyPhotos(destroy)
//     .then((destroyedPhotoids) => {
//       sails.log("destroyedPhotoids --Photo.updatePhotos-- :::\n", destroyedPhotoids);
//       let updatedPhotos = _.map(update, (updateObj, photoId) => {
//         return Photo.update({ id: photoId }, updateObj)
//           .then((photos) => {
//             return photos[0];
//           });
//       });
//       return Promise.all(updatedPhotos);
//     })
//     .then((updatedPhotos) => {
//       sails.log("updatedPhotos --Photo.updatePhotos-- :::\n", updatedPhotos);
//       return [updatedPhotos, ImageService.createPhotos(req, ['JOODANG'], create)];
//     })
//     .spread((updatedPhotos, createdPhotos) => {
//       let photos = updatedPhotos.concat(createdPhotos);
//       let photoIds = _.pluck(photos, 'id');
//       return res.ok({
//         ids: photoIds
//       });
//     })
//     .catch((err) => {
//       return res.negotiate(err);
//     });
// }
