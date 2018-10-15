const httpStatus = require('http-status');
const {
  omit
} = require('lodash');
const User = require('../models/user.model');
const {
  handler: errorHandler
} = require('../middlewares/error');
const shuffle = require('shuffle-array');
var mongoose = require('mongoose');
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = {
      user
    };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */

exports.getOne = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        err: 'could not find user'
      });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

exports.get = (req, res) => res.status(200).json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.status(200).json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const {
      user
    } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, {
      override: true,
      upsert: true
    });
    const savedUser = await User.findById(user._id);

    res.status(200).json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then(savedUser => res.status(200).json(savedUser))
    .catch(e => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map(user => user.transform());
    res.status(200).json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const {
    user
  } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};

/**
 * Find One user
 * @public
 */

exports.findByUserID = (req, res) => {
  let userID = req.params.userID;
  console.log(userID);
  User.find({
    userID
  }, function(err, person) {
    if (err) return handleError(err);
    res.status(200).send(person);
  });
}

/**
 * All users
 * @public
 */

exports.getAllUsers = (req, res) => {
  User.find({})
    .exec((err, result) => {
      if (err) {
        res.status(500).send("Internal error");
      } else {
        res.status(200).send(result);
      }
    });
}

/**
 * Single user
 * @public
 */

exports.getSingleUser = (req, res) => {
  console.log('hello');
  return false;
  User.findOne({
      'userID': req.params.id
    })
    .exec((err, result) => {
      if (err) {
        res.status(500).send("Internal error");
      } else {
        res.status(200).send(result);
      }
    });
}

exports.getAllMatchingUsers = (req, res) => {


  let listOfUsers = req.body.users.map((value) => {
    return value;
  })
  console.log(listOfUsers);
  User.find({
    "userID": {
      $in: listOfUsers
    }
  }).limit(10).
  sort({
    occupation: -1
  }).exec((err, data) => {
    if (err) {
      new new Error({
        message: 'Error Occured'
      })
    } else if (data.length === 0) {
      return res.status(200).send([{
        message: 'Data Unavailable',
        count: data.length
      }]);
    } else {
      return res.status(200).send(data);
    }
  })
}

exports.getWishByID = (req, res, next) => {
  let user = req.user;
  let interestedIn = req.params.id;
  let oppositeGenderUsers = new Array();
  User.findByGender(interestedIn, user.likes.concat(user.dislikes)).then(function(users) {
    if (users.length >= 10) {
      let arrayUsers = new Array();
      arrayUsers = shuffle.pick(users, {
        'picks': 10
      });
      user.profiles_sent = arrayUsers;
      user.likes.concat(user.dislikes).map(id => {
        user.profiles_sent.push(id);
      });
      user.save().then(function(user) {
        res.status(200).send({
          users: arrayUsers
        });
      }).catch(function(e) {
        next(e);
      });
    } else if (users.length >= 2) {
      if (users.length % 2 != 0) {
        users.pop();
      }

      user.profiles_sent = users;
      user.likes.concat(user.dislikes).map(id => {
        user.profiles_sent.push(id);
      });
      user.save().then(function(user) {
        res.status(200).send({
          users: users
        });
      }).catch(function(e) {
        next(e);
      });
    } else {

      res.status(202).send({
        message: "No users left"
      });
    }
  }).catch(function(err) {
    next(err);
  });
}


exports.createWishByID = (req, res, next) => {
  req.user.likes.push(req.body.liked);
  req.user.dislikes.push(req.body.disliked);
  var interestedIn = req.params.id;
  req.user.save().then(function(user) {
    User.findByGender(interestedIn, user.profiles_sent).then(function(users) {
      if (users.length >= 2) {
        var arrayUsers = new Array();
        arrayUsers = shuffle.pick(users, {
          'picks': 2
        });
        user.profiles_sent.push(arrayUsers[0]);
        user.profiles_sent.push(arrayUsers[1]);
        user.save().then(function(user) {

          res.status(200).send({
            users: arrayUsers
          });
        }).catch(function(e) {
          next(e);
        });
      } else {

        res.status(202).send({
          message: "No users left"
        });
      }
    }).catch(function(err) {
      next(err);
    });
  });
}


exports.getMyWish = (req, res) => {
  var user = req.user;
  user.status = 'online';
  if (user.length === 0) {
    return res.status(200).send([{
      message: 'Unavailable to get WishList',
      count: user.length
    }]);
  }
  res.status(200).send({
    user: user
  });
}

exports.postMyWish = (req, res) => {
  if (req.body.liked == true) {
    req.user.likes.push(req.user._id);
  } else {
    req.user.dislikes.push(req.user._id);
  }
  req.user.save().then(function(user) {
    if (user.length === 0) {
      return res.status(200).send([{
        message: 'Wish is Unavailable',
        count: user.length
      }]);
    }
    res.status(200).send({
      user: user
    });
  });
}

exports.findGender = (req, res, next) => {
  var gender = req.body.gender;
  console.log(gender);
  if (req.body.gender === 'Male') {
    User.find({
      gender: {
        $all: ['Female']
      }
    }, function(err, user) {
      if (err)
        return new Error(err);
      res.status(200).send({
        'message': 'here is list of females',
        user
      })
    })
  } else if (req.body.gender === 'Female') {
    User.find({
      gender: {
        $all: ['Male']
      }
    }, function(err, user) {
      if (err)
        return new Error(err);
      res.status(200).send({
        'message': 'here is list of males',
        user
      })
    })
  } else if (req.body.gender === 'Others') {
    User.find({}, function(err, user) {
      if (err)
        return new Error(err);
      res.status(200).send({
        'message': 'here is list of others',
        user
      })
    })
  } else {
    res.send({
      message: "User does not exits",
      response: `no info found for ${gender}.`
    });
  }


}

// var initials = Array.prototype.map.call(user.name.split(" "), function(x) {
//   return x.substring(0, 1).toUpperCase();
// }).join('');