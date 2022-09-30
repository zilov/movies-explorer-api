const { isCelebrateError } = require('celebrate');

const handleCelebrateErrors = (res, err) => {
  // https://github.com/arb/celebrate/issues/224 - иначе месседж пустой
  let message = '';
  for (const value of err.details.values()) {
    message += `${value.message}; `;
  }
  return res.status(400).send({ message });
}

const errorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    handleCelebrateErrors(res, err);
  } else {
    const { message } = err;
    res.status(err.statusCode || 500).send({message: message || 'Произошла ошибка на сервере!'})
  }
  return next();
}

module.exports = { errorHandler };