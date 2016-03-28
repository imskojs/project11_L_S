module.exports.models = {
  migrate: 'safe',
  // migrate: 'alter',
  // migrate: 'drop',

  connection: 'someMongodbServer',

  schema: false,
  autoCreatedBy: true,
  dynamicFinders: false,
};
