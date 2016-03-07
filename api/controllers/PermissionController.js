// api/controllers/PermissionController.js

'use strict';
var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/PermissionController');

_.merge(exports, _super);
_.merge(exports, {


  getPermissions: getPermissions,

  findById: findById,
  createPermission: createPermission,
  updatePermission: updatePermission,
  removePermission: removePermission

});


function getPermissions(req, res) {

  var roleId = req.param("roleId");

  var olderThan = req.param("olderThan");
  var newerThan = req.param("newerThan");
  var skip = req.param("skip");
  var limit = parseInt(req.param("limit"), 10);
  var sort = req.param("sort");
  var filter = req.param("filter");

  var dateOlderThan = req.param("dateOlderThan");
  var dateNewerThan = req.param("dateNewerThan");

  sails.log.debug("Fetching permissions");

  if (!QueryService.checkParamPassed(roleId)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  var query = {};
  query.where = {
    role: roleId
  };

  if (filter)
    query.where.or = [{
      'name': {
        'contains': filter
      }
    }];


  if (olderThan)
    query.where.id = {
      '<': olderThan
    };

  if (newerThan)
    if (query.where.id)
      query.where.id['>'] = newerThan;
    else
      query.where.id = {
        '>': newerThan
      };

  if (skip)
    query.skip = skip;
  if (sort)
    query.sort = sort;
  if (limit)
    query.limit = ++limit;

  if (dateOlderThan) {
    var date = new Date(dateOlderThan);
    query.where.createdAt = {
      '<': date
    }
  }

  if (dateNewerThan) {
    var date = new Date(dateNewerThan);
    query.where.createdAt = {
      '>': date
    }
  }


  sails.log.debug("Query condition: " + JSON.stringify(query));

  //Model.find({ where: { name: 'foo' }, skip: 20, limit: 10, sort: 'name DESC' });
  Permission.find(query)
    .populateAll()
    .then(function(permissions) {

      // See if there's more
      var more = (permissions[limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) permissions.splice(limit - 1, 1);

      res.ok({
        permissions: permissions,
        more: more
      });
    })
    .catch(function(err) {
      sails.log.error(err);
      res.send(500, {
        message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
      });
    });
}


function findById(req, res) {

  var id = req.param("id");

  if (!QueryService.checkParamPassed(id)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  Permission.findOne({
      id: id
    })
    .populateAll()
    .then(function(permission) {

      res.send(200, permission);

    })
    .catch(function(err) {
      sails.log.error(err);
      res.send(500, {
        message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
      });
    });
}

function createPermission(req, res) {

  var permission = req.allParams();

  sails.log.debug(JSON.stringify(permission));

  if (permission.id) {
    delete permission.id;
  }

  // Adding user info
  permission.createdBy = req.user;

  Permission.create(permission)
    .exec(function(err, permission) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
        });
      }

      res.send(200, permission);
    });

}


function updatePermission(req, res) {
  var permission = req.allParams();

  var id = permission.id;

  // Things user can't update
  delete permission.id;
  delete permission.createdBy;
  delete permission.createdDevice;
  delete permission.createdAt;
  delete permission.updatedAt;

  // Adding user info
  permission.updatedBy = req.user.id;

  sails.log.debug(JSON.stringify(permission));

  if (!QueryService.checkParamPassed(id)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  // needs to check whether user is owner

  Permission.update({
      id: id
    }, permission)
    .exec(function(err, updatedPermission) {

      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
        });
      }

      res.send(200, updatedPermission);

    });
}


function removePermission(req, res) {
  var id = req.param("id");

  if (!QueryService.checkParamPassed(id)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  Permission.findOne({
      id: id
    })
    .populateAll()
    .then(function(permission) {

      sails.log.debug("removing:" + JSON.stringify(permission));

      // Remove photos associated with permission
      _.forEach(permission.photos, function(photo) {
        sails.log.debug(photo);
        ImageService.deletePhoto(photo.id);
      });

      return Permission.destroy({
        id: id
      });
    })
    .then(function(permissions) {
      res.send(200, permissions);
    })
    .catch(function(err) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
        });
      }
    });
}
