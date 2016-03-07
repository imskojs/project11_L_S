'use strict';
module.exports = {
  getCriterias: getCriterias,
  // getMyCriterias: getMyCriterias,

  findById: findById,
  createCriteria: createCriteria,
  updateCriteria: updateCriteria,
  removeCriteria: removeCriteria
};


function getCriterias(req, res) {

  var permissionId = req.param("permissionId");

  var olderThan = req.param("olderThan");
  var newerThan = req.param("newerThan");
  var skip = req.param("skip");
  var limit = parseInt(req.param("limit"), 10);
  var sort = req.param("sort");
  var filter = req.param("filter");

  var dateOlderThan = req.param("dateOlderThan");
  var dateNewerThan = req.param("dateNewerThan");

  sails.log.debug("Fetching criterias");

  if (!QueryService.checkParamPassed(permissionId)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }


  var query = {};
  query.where = {
    permission: permissionId
  };

  if (filter)
    query.where.or = [{
      'name': {
        'contains': filter
      }
    }, {
      'notes': {
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

  var date;
  if (dateOlderThan) {
    date = new Date(dateOlderThan);
    query.where.createdAt = {
      '<': date
    };
  }

  if (dateNewerThan) {
    date = new Date(dateNewerThan);
    query.where.createdAt = {
      '>': date
    };
  }


  sails.log.debug("Query condition: " + JSON.stringify(query));

  //Model.find({ where: { name: 'foo' }, skip: 20, limit: 10, sort: 'name DESC' });
  return Criteria.find(query)
    .populateAll()
    .then(function(criterias) {

      // See if there's more
      var more = (criterias[limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) criterias.splice(limit - 1, 1);

      res.ok({
        criterias: criterias,
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


// function getMyCriterias(req, res) {

//   var ownerId = req.user.id;

//   var olderThan = req.param("olderThan");
//   var newerThan = req.param("newerThan");
//   var skip = req.param("skip");
//   var limit = req.param("limit");
//   var sort = req.param("sort");
//   var filter = req.param("filter");

//   var dateOlderThan = req.param("dateOlderThan");
//   var dateNewerThan = req.param("dateNewerThan");


//   if (!id) {
//     return res.send(403, {
//       message: "로그인을 해주세요. 서버에러 code: 002"
//     });
//   }

//   var query = {};
//   query.where = {
//     criteriaOwner: ownerId
//   };
//   if (filter)
//     query.where.or = [{
//       'name': {
//         'contains': filter
//       }
//     }, {
//       'notes': {
//         'contains': filter
//       }
//     }];

//   if (olderThan)
//     query.where.id = {
//       '<': olderThan
//     };

//   if (newerThan)
//     if (query.where.id)
//       query.where.id['>'] = newerThan;
//     else
//       query.where.id = {
//         '>': newerThan
//       };

//   if (skip)
//     query.skip = skip;
//   if (sort)
//     query.sort = sort;
//   if (limit)
//     query.limit = ++limit;

//   if (dateOlderThan) {
//     var date = new Date(dateOlderThan);
//     query.where.createdAt = {
//       '<': date
//     }
//   }

//   if (dateNewerThan) {
//     var date = new Date(dateNewerThan);
//     query.where.createdAt = {
//       '>': date
//     }
//   }

//   //Model.find({ where: { name: 'foo' }, skip: 20, limit: 10, sort: 'name DESC' });
//   Criteria.find(query)
//     .populateAll()
//     .then(function(criterias) {

//       // See if there's more
//       var more = (criterias[limit - 1]) ? true : false;
//       // Remove item over 20 (only for check purpose)
//       if (more) criterias.splice(limit - 1, 1);

//       res.ok({
//         criterias: criterias,
//         more: more
//       });
//     })
//     .catch(function(err) {
//       sails.log.error(err);
//       res.send(500, {
//         message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
//       });
//     });
// }


function findById(req, res) {

  var id = req.param("id");

  if (!QueryService.checkParamPassed(id)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  return Criteria.findOne({
      id: id
    })
    .populateAll()
    .then(function(criteria) {

      res.send(200, criteria);

    })
    .catch(function(err) {
      sails.log.error(err);
      res.send(500, {
        message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
      });
    });
}

function createCriteria(req, res) {

  var criteria = req.allParams();

  sails.log.debug(JSON.stringify(criteria));

  if (criteria.id) {
    delete criteria.id;
  }

  // Adding user info
  criteria.createdBy = req.user;

  return Criteria.create(criteria)
    .exec(function(err, criteria) {
      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
        });
      }

      res.send(200, criteria);
    });

}


function updateCriteria(req, res) {
  var criteria = req.allParams();

  var id = criteria.id;

  // Things user can't update
  delete criteria.id;
  delete criteria.createdBy;
  delete criteria.createdDevice;
  delete criteria.createdAt;
  delete criteria.updatedAt;

  // Adding user info
  criteria.updatedBy = req.user.id;

  sails.log.debug(JSON.stringify(criteria));

  if (!QueryService.checkParamPassed(id)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  // needs to check whether user is owner

  return Criteria.update({
      id: id
    }, criteria)
    .exec(function(err, updatedCriteria) {

      if (err) {
        sails.log.error(err);
        res.send(500, {
          message: "예약 로딩을 실패 했습니다. 서버에러 code: 001"
        });
      }

      res.send(200, updatedCriteria);

    });
}


function removeCriteria(req, res) {
  var id = req.param("id");

  if (!QueryService.checkParamPassed(id)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  return Criteria.findOne({
      id: id
    })
    .populateAll()
    .then(function(criteria) {

      sails.log.debug("removing:" + JSON.stringify(criteria));

      // Remove photos associated with criteria
      _.forEach(criteria.photos, function(photo) {
        sails.log.debug(photo);
        ImageService.deletePhoto(photo.id);
      });

      return Criteria.destroy({
        id: id
      });
    })
    .then(function(criterias) {
      res.send(200, criterias);
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
