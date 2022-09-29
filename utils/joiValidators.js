const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { errorMessages } = require("./constants");

const commonJoiValidators = {
  link: Joi.string().custom((value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.message(errorMessages.nonValidURL)
  }),
}

const postSignInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  }),
})

const postSignUpValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
})

const postMovieValidator = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: commonJoiValidators.link.required(),
    trailerLink: commonJoiValidators.link.required(),
    thumbnail: commonJoiValidators.link.required(),
    movieId: Joi.number().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
})

const patchUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().min(2).max(30).email().required(),
  }),
})

module.exports = {
  postSignInValidator,
  postSignUpValidator,
  postMovieValidator,
  deleteMovieValidator,
  patchUserValidator
}