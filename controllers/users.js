const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Users = require('../models/user');

const {
  BadRequestError,
  AlreadyExistsError,
  NotFoundError,
  InternalServerError,
} = require('./errors');

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AlreadyExistsError('User is already exists! Please sign in!');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      req.body.password = hash;
      return Users.create(req.body);
    })
    .then(() => res.send({ message: 'User successfully created!' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Validation error: ${err.message}`));
      } if (err instanceof AlreadyExistsError) {
        return next(err);
      }
      return next(new InternalServerError(err.message));
    });
};

const getCurrentUser = (req, res, next) => Users.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('User not found!');
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err instanceof NotFoundError) {
      return next(err);
    }
    return next(new InternalServerError(err.message));
  });

const updateUserInfo = (req, res, next) => {
  Users.findByIdAndUpdate(
    req.user._id,
    {
      $set:
      {
        name:
          req.body.name ? req.body.name : req.user.name,
        email:
          req.body.email ? req.body.email : req.user.email,
      },
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError(`Cannot update user info! ${req.user._id}`);
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Validation error: ${err.message}`));
      } if (err instanceof BadRequestError) {
        return next(err);
      }
      return next(new InternalServerError(err.message));
    });
};

module.exports = {
  createUser,
  updateUserInfo,
  getCurrentUser,
};
