const bcrypt = require('bcryptjs');
const Users = require('../models/user');
const { errorMessages, successMessages } = require('../utils/constants');

const {
  BadRequestError,
  AlreadyExistsError,
  NotFoundError,
} = require('./errors');

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AlreadyExistsError(errorMessages.userAlreadyExists);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      req.body.password = hash;
      return Users.create(req.body);
    })
    .then(() => res.send({ message: successMessages.userCreated }))
    .catch((err) => {
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => Users.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError(errorMessages.userNotFound);
    }
    return res.send(user);
  })
  .catch((err) => {
    return next(err);
  });

const updateUserInfo = (req, res, next) => {
  Users.findByIdAndUpdate(
    req.user._id,
    {
      $set:
      {
        name:
          req.body.name,
        email:
          req.body.email,
      },
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError(`${errorMessages.cannotUpdateUser} ${req.user._id}`);
      }
      return res.send(user);
    })
    .catch((err) => {
      return next(err);
    });
};

module.exports = {
  createUser,
  updateUserInfo,
  getCurrentUser,
};
