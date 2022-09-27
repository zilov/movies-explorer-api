const mongoose = require('mongoose');
const Movies = require('../models/movie');

const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
} = require('./errors');

const getMovies = (req, res, next) => Movies.find({})
  .then((movies) => res.send(movies))
  .catch((err) => next(new InternalServerError(err.message)));

const addMovie = (req, res, next) => {
  req.body.owner = req.user._id;
  return Movies.create(req.body)
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Validation error: ${err.message}`));
      }
      return next(new InternalServerError(err.message));
    });
};

const deleteMovie = (req, res, next) => Movies.findById(req.params.id)
  .then((movie) => {
    if (!movie) {
      throw new NotFoundError('Movie was already deleted or not exists');
    }
    if (!req.user._id.equals(movie.owner)) {
      throw new ForbiddenError('Cannot delete movie of other users');
    }
    return Movies.findByIdAndDelete(req.params.id);
  })
  .then(() => res.send({ message: 'Movie was successfully deleted' }))
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError(`Id is not valid ${err.message}`));
    } if (err instanceof NotFoundError || err instanceof ForbiddenError) {
      return next(err);
    }
    return next(new InternalServerError(err.message));
  });


  module.exports = {
    getMovies,
    addMovie,
    deleteMovie
  };