const mongoose = require('mongoose');
const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET }  = process.env;

const {
  InternalServerError,
  UnauthorizedError
} = require('./errors');

const login = (req, res, next) => Users.findOne({ email: req.body.email }).select('+password')
  .then((user) => {
    if (!user) {
      throw new UnauthorizedError('Wrong email or password');
    }
    return bcrypt.compare(req.body.password, user.password)
      .then((matched) => {
        // если все ок - генерим и сохраняем jwt, если нет - кидаем ошибку
        if (!matched) {
          throw new UnauthorizedError('Wrong email or password');
        }
        const token = jwt.sign({ _id: user._id },
           NODE_ENV === 'production' ? JWT_SECRET : 'secret',
           { expiresIn: '7d' });
        res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
        req.user = user;
        return res.send({ token });
      })
      .catch((err) => next(err));
  })
  .catch((err) => {
    if (err instanceof UnauthorizedError) {
      return next(err);
    }
    return next(new InternalServerError(`Cannot get access to server for login: ${err.message}`));
  });

module.exports = {
  login
};
