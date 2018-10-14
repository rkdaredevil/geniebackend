const httpStatus = require('http-status');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
const {
  jwtExpirationInterval
} = require('../../config/vars');
const {
  sendVerificationEmail
} = require('./verification.controller');
const {
  sendVerificationMail,
  sendVerificationSms
} = require('../../config/vars');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'days');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const user = await (new User(req.body)).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    if (sendVerificationMail) {
      sendVerificationEmail(user.uuid, {
        to: userTransformed.email
      });
    }
    return res.status(200).json({
      token,
      user: userTransformed
    });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};


exports.phoneRegister = (req, res, next) => {
  req.body.display_name_as = req.body.display_name;
  if (req.body.display_name === 'First Name') {
    req.body.display_name = req.body.name.split(' ')[0];
  } else if (req.body.display_name === 'Full Name') {
    req.body.display_name = req.body.name;
  } else {
    req.body.display_name = initials(req.body.name);
  }
  if (req.body.authType === 'phone') {
    User.findOne({
      phone: req.body.phone
    }, async (user) => {

      if (!user) {
        try {
          const user = await (new User(req.body)).save();
          const token = generateTokenResponse(user, user.token());
          res.status(httpStatus.CREATED);
          return res.status(200).json({
            message: 'Successfully registered here',
            token,
            user: user
          });
        } catch (e) {
          return next(User.checkDuplicateEmail(e));
        }


      }

    })
  }
}
/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const {
      user,
      accessToken
    } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.status(200).json({
      token,
      user: userTransformed
    });
  } catch (error) {
    return next(error);
  }
};

exports.phoneLogin = (req, res, next) => {
  let authType, phone = req.body;
  if (req.body.authType !== 'phone') {
    return res.status(422).json({
      errors: {
        authType: 'is required',
      },
    });
  }

  if (!req.body.phone) {
    return res.status(422).json({
      errors: {
        phone: 'is required',
      },
    });
  }
  User.findOne({
    phone: req.body.phone
  }, null, {
    safe: true
  }, (err, user) => {
    if (user != null && user != undefined && user.length < 1) {

      res.status(422).send({
        message: 'something went wrong'
      })
    } else if (user === null || user === undefined) {
      console.log('help');
      res.status(202).send({
        message: 'No Data Available'
      })
    } else {

      const token = generateTokenResponse(user, user.token());
      res.status(200).send({
        token,
        user: user
      })
    }
  })


}
/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const {
      user
    } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    if (!user.email) {
      res.status(422).send({
        message: 'email is required to create profile, try other method'
      })
    }
    return res.status(200).json({
      token,
      user: user
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const {
      email,
      refreshToken
    } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const {
      user,
      accessToken
    } = await User.findAndGenerateToken({
      email,
      refreshObject
    });
    const response = generateTokenResponse(user, accessToken);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a null token when given a valid refresh token
 * @public
 */

exports.logout = async (req, res, next) => {
  try {
    const {
      email,
      refreshToken
    } = req.body;
    const destroyToken = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    return res.status(200).send({
      user: false,
      token: null,
      message: 'Succesfully logout from system.'
    })
  } catch (error) {
    return next(error);
  }

};