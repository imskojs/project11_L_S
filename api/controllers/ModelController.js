// api/controllers/ModelController.js

'use strict';
var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/ModelController');

_.merge(exports, _super);
_.merge(exports, {
  getModels: getModels
});

function getModels(req, res) {

  return Model.find()
    .then(function(models) {
      return res.ok(models);
    })
    .catch(function(err) {
      sails.log.error(err);
      res.send(500, {
        message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
      });
    });
}
