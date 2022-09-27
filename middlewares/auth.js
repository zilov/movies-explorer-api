const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const { NODE_ENV, JWT_SECRET }  = process.env;

const {
  UnauthorizedError,
  NotFoundError,
} = require('../controllers/errors');

const checkToken = async (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UnauthorizedError('Cannot find JWT! Please sign in!'));
  }
  const decoded = await jwt.verify(req.cookies.jwt,
    NODE_ENV === 'production' ? JWT_SECRET : 'secret');
  if (!decoded) {
    return next(new UnauthorizedError('Cannot find JWT! Please sign in!'));
  }
  const user = await Users.findById(decoded)
  if (!user) {
    return next(new NotFoundError('Please sign in! Token is expired, cannot find user!'));
  }
  req.user = user;
  return next();
}

module.exports = {
  checkToken,
};
