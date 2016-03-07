// api/hooks/sails-permissions.js


module.exports = function (sails) {
  return {
    identity: 'permissions',

    /**
     * Local cache of Model name -> id mappings to avoid excessive database lookups.
     */
    _modelCache: {},

    initialize: function (next) {

      sails.after(sails.config.permissions.afterEvent, function () {
        installModelOwnership(sails);
      });

      sails.after('hook:orm:loaded', function () {

        Model.count()
          .then(function (count) {
            if (count == sails.models.length) return next();

            return initializeFixtures(sails)
              .then(function () {
                sails.emit('hook:permissions:loaded');
                next();
              });
          })
          .catch(function (error) {
            sails.log.error(error);
            next(error);
          });


      });
    }
  };
};

function initializeFixtures(sails) {
  return require('sails-permissions/config/fixtures/model').createModels()
    .bind({})
    .then(function (models) {
      this.models = models;

      sails.hooks['sails-permissions']._modelCache = _.indexBy(models, 'identity');

      return "temp";
    })
    .catch(function (error) {
      sails.log.error(error);
    });
}

function installModelOwnership(sails) {
  var models = sails.models;
  if (sails.config.models.autoCreatedBy === false) return;

  _.each(models, function (model) {
    if (model.autoCreatedBy === false) return;


    _.defaults(model.attributes, {
      createdBy: {
        model: 'User',
        index: true
      },
      owner: {
        model: 'User',
        index: true
      }
    });
  });
}


