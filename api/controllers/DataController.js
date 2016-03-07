 'use strict';
 var Promise = require('bluebird');
 var _ = require('lodash');
 var ObjectID = require('mongodb').ObjectID;

 module.exports = {
   importCollection: importCollection,
   exportCollection: exportCollection
 };

 function importCollection(req, res) {

   var data = req.allParams();

   var options = {};
   var modelName = '';

   if (data.forceServerObjectId) {
     options.forceServerObjectId = data.forceServerObjectId;
     delete data.forceServerObjectId;
   }

   if (!QueryService.checkParamPassed(data.model)) {
     return res.send(400, {
       message: "모든 매개 변수를 입력해주세요 code: 003"
     });

   } else {
     modelName = data.model;
     delete data.model;
   }

   return Promise.resolve(
       QueryService.executeInsertNative(
         sails.models[modelName.toLowerCase()],
         data.data, options))
     .then(function(result) {
       return res.ok(result.insertedIds);
     })
     .catch(function(err) {
       sails.log.error(err);
       return res.send(500, {
         message: "들여오기를 실패 했습니다. 서버에러 code: 001"
       });
     });

 }

 function exportCollection(req, res) {
   var queryWrapper = QueryService.buildQuery(req);
   sails.log("-----------  queryWrapper: Data.exportCollection  -------------");
   sails.log(queryWrapper);

   var data = queryWrapper.query;

   if (!QueryService.checkParamPassed(data.model)) {
     return res.send(400, {
       message: "모든 매개 변수를 입력해주세요 code: 003"
     });
   }

   var ModelNative = Promise.promisify(sails.models[data.model.toLowerCase()].native);

   return ModelNative()
     .then(function(collection) {

       var deferred = Promise.pending();

       collection
         .find()
         .toArray(function(err, results) {
           if (err) {
             deferred.reject(err);
           } else {
             deferred.resolve(results);
           }
         });

       return deferred.promise;
     })
     .then(function(array) {

       _.map(array, function(item) {

         _.each(item, function(val, key) {
           if (val instanceof ObjectID) {
             item[key] = "ObjectId(" + val.toString() + ")";
           }
         });

         return item;
       });

       res.ok(array);
     })
     .catch(function(err) {
       sails.log(err);
       return res.send(400, {
         message: "Error getting native code: 012"
       });
     });
 }
