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

const postMovieValidator = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: commonJoiValidators.required(),
    trailerLink: commonJoiValidators.required(),
    thumbnail: commonJoiValidators.required(),
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
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30).email(),
  }),
})

module.exports = {
  postMovieValidator,
  deleteMovieValidator,
  patchUserValidator
}