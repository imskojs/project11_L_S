// api/controllers/AuthController.js

'use strict';
var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/AuthController');
var request = require('request');
var Promise = require('bluebird');

_.merge(exports, _super);
_.merge(exports, {

  checkNickname: checkNickname,
  checkUsername: checkUsername,
  checkEmail: checkEmail,

  login: login,
  logout: logout,

  register: register,
  registerPassport: registerPassport,

  forgotPasswordStart: forgotPasswordStart,
  forgotPasswordCheck: forgotPasswordCheck,
  forgotPasswordComplete: forgotPasswordComplete,
  changePassword: changePassword
});


function checkNickname(req, res) {

  var nickname = req.param("nickname");

  if (!QueryService.checkParamPassed(nickname)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  User.findOne({
      nickname: nickname
    })
    .then(function(user) {
      if (user) {
        res.send(200, {
          isAvailable: false
        });
      } else {
        res.send(200, {
          isAvailable: true
        });
      }
    })
    .catch(function(err) {
      sails.log.error(err);
      res.send(500, {
        message: "닉네임 찾기를 실패 했습니다. 서버에러 code: 001"
      });
    });
}


function checkUsername(req, res) {

  var username = req.param("username");

  if (!QueryService.checkParamPassed(username)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  User.findOne({
      username: username
    })
    .then(function(user) {

      if (user) {
        res.send(200, {
          isAvailable: false
        });
      } else {
        res.send(200, {
          isAvailable: true
        });
      }
    })
    .catch(function(err) {
      sails.log.error(err);
      res.send(500, {
        message: "Username 찾기를 실패 했습니다. 서버에러 code: 001"
      });
    });
}

function checkEmail(req, res) {

  var email = req.param("email");

  if (!QueryService.checkParamPassed(email)) {
    res.send(400, {
      message: "모든 매개 변수를 입력해주세요 code: 003"
    });
    return;
  }

  User.findOne({
      email: email
    })
    .then(function(user) {

      if (user) {
        res.send(200, {
          isAvailable: false
        });
      } else {
        res.send(200, {
          isAvailable: true
        });

      }
    })
    .catch(function(err) {
      sails.log.error(err);
      res.send(500, {
        message: "이메일 찾기를 실패 했습니다. 서버에러 code: 001"
      });
    });
}

function login(req, res) {

  sails.services.passport.callback(req, res, (err, user) => {
    sails.log("-----------  req.allParams()  -------------");
    sails.log(req.allParams());
    sails.log("-----------  err  -------------");
    sails.log(err);

    sails.log("-----------  user  -------------");
    sails.log(user);
    if (err || !user) {
      return res.forbidden();
    }

    req.login(user, function(err) {
      if (err) {
        sails.log.warn(err);
        return res.forbidden();
      }

      sails.log(user);

      User.findOne({
          id: user.id
        })
        .populate('roles')
        .then((user) => {
          sails.log.info('user', user, 'authenticated successfully');
          req.session.authenticated = true;
          let token = UtilService.getToken(user);

          return res.send(200, {
            user: user,
            token: token
          });
        })
        .catch((err) => {
          return res.send(400, err);
        });

    });
  });

}

function logout(req, res) {
  req.session.authenticated = false;
  return res.send(200, {
    message: "로그아웃 하셧습니다."
  });
}

function register(req, res) {

  sails.log("-----------  req.allParams()  -------------");
  sails.log(req.allParams());
  // var user = QueryService.buildQuery({}, req.allParams()).query;
  var user = req.body;

  //password:
  //email:
  delete user.roles;

  sails.log.debug(user);

  sails.services.passport.protocols.local.register(user, function(err, user) {
    if (err) {
      return res.send(500, {
        message: err
      });
    }

    return res.ok(user);
  });
}

function registerPassport(req, res) {

  var access_token = req.param("access_token");
  var refresh_token = req.param("refresh_token");
  var provider = req.param("provider");

  sails.log.debug("AuthController - start registering passport");

  if (!QueryService.checkParamPassed(access_token)) {
    res.send(400, {
      message: "Please pass all the parameters"
    });
    return;
  }

  var options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    }
  };

  if (provider === 'kakao') {
    options.url = 'https://kapi.kakao.com/v1/user/me';
  } else {
    options.url = 'https://graph.facebook.com/v2.2/me';
  }

  request.get(options,
    function(error, response, body) {
      if (error) {
        res.send(400, {
          message: "not a valid user"
        });
        return;
      }

      var data = JSON.parse(body);

      var userData = UtilService.userInfoParser(provider, data);

      sails.log.debug(userData);

      User.findOne({
        username: "" + userData.username
      }, function(err, user) {

        sails.log.debug(user);

        if (err) {
          res.send(400, {
            message: "not a valid user"
          });
          return;
        }

        // new User
        if (!user) {

          Promise.resolve(Role.findOne({
              name: 'USER',
              sort: 'createdAt DESC'
            }))
            .bind({})
            .then(function(role) {

              //this.role = role;

              userData.roles = [];
              userData.roles.push(role);

              delete userData.email;

              return User.create(userData);
            })
            .then(function(createdUser) {

              this.createdUser = createdUser;

              var tokens = {
                access_token: access_token
              };

              if (refresh_token)
                tokens.refresh_token = refresh_token;

              var passportNew = {
                protocol: 'oauth2',
                provider: provider,
                identifier: data.id,
                accessToken: access_token,
                tokens: tokens,
                user: createdUser
              };

              sails.log.debug("AuthController - start creating passport" + JSON.stringify(passportNew));

              return Passport.create(passportNew);
            })
            .then(function(passport) {

              sails.log.debug("AuthController - passport register finish");

              var userDetail = {
                id: this.createdUser.id,
                username: this.createdUser.username,
                nickname: this.createdUser.nickname,
                profile_image: this.createdUser.profile_image,
                thumbnail_image: this.createdUser.thumbnail_image,
                role: this.createdUser.role
              };

              res.send(200, {
                user: userDetail,
                token: passport.tokens.access_token,
                action: 'registered'
              });

            })
            .catch(function(err) {
              sails.log.error(err);

              var id = this.createdUser && this.createdUser.id;

              if (id) {
                User.destroy({
                    id: id
                  })
                  .exec(function(err, user) {
                    if (err) {
                      sails.log("-----------  err  -------------");
                      sails.log(err);
                    } else {
                      sails.log("-----------  user  -------------");
                      sails.log(user);
                    }
                  });
              }


              res.send(500, {
                message: "회원가입을 실패 했습니다. 서버에러 code: 001"
              });
            });


        } else {
          //ignore for registered user
          sails.log.debug("AuthController - user exist update token");

          //Update user data
          user = _.extend(user, userData);
          user.save();

          var userDetail = {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            profile_image: user.profile_image,
            thumbnail_image: user.thumbnail_image,
            role: user.role
          };

          var newToken = {
            accessToken: access_token,
            tokens: {
              access_token: access_token,
              refresh_token: refresh_token
            }
          };

          Passport.update({
              identifier: "" + data.id,
              provider: provider
            }, newToken)
            .exec(function(err, updatedPassport) {

              sails.log.debug(updatedPassport);

              if (err) {
                res.send(400, "카카오톡과 연결을 실패 했습니다.");
                return;
              }

              res.send(200, {
                user: userDetail,
                token: updatedPassport[0].accessToken,
                action: 'exist'
              });
            });
        }
      });
    });
}


function forgotPasswordStart(req, res) {

  var email = req.param("email");

  if (!QueryService.checkParamPassed(email)) {
    res.send(400, {
      message: "Please pass all the parameters"
    });
    return;
  }

  User.findOne({
      email: email
    })
    .then(function(user) {
      if (user && user.email.toLowerCase() === email.toLowerCase()) {

        if (user.password_reset_counter > 9) {
          return res.send(500, {
            message: "You have exceeded number of allowed find password request"
          });
        } else {

          req.activator = {
            user: user,
            id: user.email,
            body: "password reset required.",
            nickname: user.nickname
          };

          UserService.sendPasswordResetEmail(req, res, function(code) {

            sails.log("-----------  code  -------------");
            sails.log(code);
            // Allow up to 10 times a day
            if (req.activator.code === 201) {


              res.send(200, {
                message: "We have sent email for one time password reset. Please reset your password using the link provided"
              });
            } else if (req.activator.code === 404) {
              res.send(404, {
                message: "Invalid user id"
              });
            } else {
              sails.log.debug('AuthController: failed to send email error: ',
                req.activator
              );
              res.send(500, {
                message: "Failed to send password reset email"
              });
            }

          });

        }


      } else {
        res.send(400, {
          message: "Email not registered"
        });
      }
    })
    .catch(function() {
      return res.send(500, {
        message: "DB Error"
      });
    });
}


function forgotPasswordCheck(req, res) {

  var email = req.param("email");
  var code = req.param("code");


  if (!QueryService.checkParamPassed(code, email)) {
    res.send(400, {
      message: "Please pass all the parameters"
    });
    return;
  }

  req.params.user = email;


  User.findOne({
      email: email
    })
    .then(function(user) {

      if (user) {

        UserService.completePasswordReset(req, res, function() {

          if (req.activator.code == 200) {
            req.session.authenticated = true;

            user.password_reset_counter = 0;
            user.save();

            var token = UtilService.getToken(user);

            return res.send(200, {
              user: user,
              token: token
            });

          } else if (req.activator.code == 400) {
            res.send(400, {
              message: "맞지않는 코드입니다"
            }); // code not matching
            return;
          } else if (req.activator.code == 404) {
            res.send(400, {
              message: "권한이 없습니다"
            });
            return;
          } else {
            res.send(500, {
              message: "서버에러"
            });
            return;
          }

        });

      } else {
        return res.send(500, {
          message: "Cannot find user"
        });
      }
    })
    .catch(function(err) {
      return res.send(500, {
        message: err + "서버에러"
      });

    });

}

function forgotPasswordComplete(req, res) {

  var email = req.user.email;

  sails.log.debug(req.user);

  var newPassword = req.param("newPassword");

  if (!QueryService.checkParamPassed(email, newPassword)) {
    res.send(400, {
      message: "Please pass all the parameters"
    });
    return;
  }


  User.findOne({
      email: email
    })
    .populate('passports', {
      protocol: 'local'
    })
    .then(function(user) {
      if (user.passports && user.passports.length > 0) {

        var passportsId = user.passports[0].id;
        Passport.update({
            id: passportsId
          }, {
            password: newPassword
          })
          .then(function(passports) {
            sails.log("-----------  passports  -------------");
            sails.log(passports);
            res.send(200, {
              message: "Password reset complete"
            });
          })
          .catch(function(err) {
            return res.send(500, {
              error: err,
              message: "failed to update password"
            });
          });

      } else {
        return res.send(500, {
          message: "not a local login account"
        });
      }
    })
    .catch(function() {
      return res.send(500, {
        message: "cannot find user info"
      });
    });

  Passport.update({
    email: email,
  }, {
    password: newPassword
  });
}


function changePassword(req, res) {
  // let queryWrapper = QueryService.buildQuery({}, req.allParams());
  console.log("---------- req.allParams() ----------");
  console.log(req.allParams());
  let queryWrapper = req.allParams();

  sails.log(queryWrapper);
  let query = queryWrapper.query;

  var oldPassword = query.oldPassword;
  var newPassword = query.newPassword;

  if (!QueryService.checkParamPassed(newPassword, oldPassword)) {
    return res.send(400, {
      message: "Please pass all the parameters"
    });
  }

  return Passport.find({
      user: req.user.id,
      protocol: 'local'
    })
    .then(function(passports) {

      sails.log(passports);

      passports[0].validatePassword(oldPassword, function(err, result) {
        if (result) {
          passports[0].password = newPassword;
          passports[0].save();
          res.ok({
            message: "비밀번호 변경을 완료 했습니다."
          });
          return;
        } else {
          res.send(400, {
            message: "맞지 않은 비밀번호를 입력 했습니다."
          });
          return;
        }

      });
    })
    .catch(function(err) {
      if (err) {
        res.send(400, {
          message: "맞는 권한 찾기를 실패 했습니다."
        });
        return;
      }
    });
}
