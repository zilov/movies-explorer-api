const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecretDevelopment } = require('../config');
const Users = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  InternalServerError,
  UnauthorizedError,
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
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDevelopment,
          { expiresIn: '7d' },
        );
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

const logout = (req, res, next) => {
  if (req.cookies.jwt) {
    res.clearCookie('jwt');
    return res.send({ message: 'Logout successful!' });
  } if (!req.cookies.jwt) {
    return next(new UnauthorizedError('User was already logout'));
  }
  return next(new InternalServerError('Cannot get access to server for logout'));
};

module.exports = {
  login,
  logout,
};
