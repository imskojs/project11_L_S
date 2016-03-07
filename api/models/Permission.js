// api/models/Permission.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/Permission');

_.merge(exports, _super);
_.merge(exports, {

    attributes: {
        name: {type: "STRING"}
    }

});
