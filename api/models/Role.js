// api/models/Role.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/Role');

_.merge(exports, _super);
_.merge(exports, {

    attributes: {
        label: {type: "STRING"},
    }
});
