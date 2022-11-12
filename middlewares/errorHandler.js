const { isCelebrateError } = require('celebrate');
const mongoose = require('mongoose');
const { BadRequestError } = require('../controllers/errors');
const { errorMessages } = require('../utils/constants');

const handleCelebrateErrors = (res, err) => {
  // https://github.com/arb/celebrate/issues/224 - иначе месседж пустой
  let message = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const value of err.details.values()) {
    message += `${value.message}; `;
  }
  res.status(400).send({ message });
};

const handleMongooseErrors = (err) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return new BadRequestError(`${errorMessages.validationError}: ${err.message}`);
  } if (err instanceof mongoose.Error.CastError) {
    return new BadRequestError(`${errorMessages.mongoIdValidity}: ${err.message}`);
  }
  return err;
};

const errorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    handleCelebrateErrors(res, err);
  } else {
    const error = handleMongooseErrors(err);
    const { message } = error;
    res.status(error.statusCode || 500).send({ message: message || 'Произошла ошибка на сервере!', status: error.statusCode || 500 });
  }
  return next();
};

module.exports = { errorHandler };
