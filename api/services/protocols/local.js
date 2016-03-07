// api/services/protocols/local.js

var _ = require('lodash');
var _super = require('sails-permissions/api/services/protocols/local');

function protocols() {
}

protocols.prototype = Object.create(_super);
_.extend(protocols.prototype, {


    login: function (req, identifier, password, next) {
        var isEmail = validateEmail(identifier)
            , query = {};


        var appId = req.param("appId")

        if (appId) {
            req.flash('error', 'Error.Application.Domain.NotFound');
            return next(null, false);
            return;
        } else {
            query.application = appId;
        }

        if (isEmail) {
            query.email = identifier;
        }
        else {
            query.username = identifier;
        }


        sails.models.user.findOne(query, function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                if (isEmail) {
                    req.flash('error', 'Error.Passport.Email.NotFound');
                } else {
                    req.flash('error', 'Error.Passport.Username.NotFound');
                }

                return next(null, false);
            }

            sails.models.passport.findOne({
                protocol: 'local'
                , user: user.id
            }, function (err, passport) {
                if (passport) {
                    passport.validatePassword(password, function (err, res) {
                        if (err) {
                            return next(err);
                        }

                        if (!res) {
                            req.flash('error', 'Error.Passport.Password.Wrong');
                            return next(null, false);
                        } else {
                            return next(null, user, passport);
                        }
                    });
                }
                else {
                    req.flash('error', 'Error.Passport.Password.NotSet');
                    return next(null, false);
                }
            });
        })

    }
});

module.exports = new protocols();
