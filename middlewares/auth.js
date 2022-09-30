const jwt = require('jsonwebtoken');
const Users = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  UnauthorizedError,
  NotFoundError,
} = require('../controllers/errors');
const { jwtSecretDevelopment } = require('../config');
const { errorMessages } = require('../utils/constants');

const checkToken = async (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UnauthorizedError(errorMessages.jwtNotFound));
  }
  const decoded = await jwt.verify(
    req.cookies.jwt,
    NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDevelopment,
  );
  if (!decoded) {
    return next(new UnauthorizedError(errorMessages.jwtNotFound));
  }
  const user = await Users.findById(decoded);
  if (!user) {
    return next(new NotFoundError(errorMessages.expiredToken));
  }
  req.user = user;
  return next();
};

module.exports = {
  checkToken,
};
