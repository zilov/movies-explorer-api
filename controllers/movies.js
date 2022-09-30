const Movies = require('../models/movie');
const { errorMessages, successMessages } = require('../utils/constants');

const {
  NotFoundError,
  ForbiddenError,
} = require('./errors');

const getMovies = (req, res, next) => Movies.find({})
  .then((movies) => res.send(movies))
  .catch((err) => next(err));

const addMovie = (req, res, next) => {
  req.body.owner = req.user._id;
  return Movies.create(req.body)
    .then((movie) => res.send(movie))
    .catch((err) => {
      return next(err);
    });
};

const deleteMovie = (req, res, next) => Movies.findById(req.params.id)
  .then((movie) => {
    if (!movie) {
      throw new NotFoundError(errorMessages.deleteMovie);
    }
    if (!req.user._id.equals(movie.owner)) {
      throw new ForbiddenError(errorMessages.deleteMovieOfOtherUser);
    }
    return Movies.findByIdAndDelete(req.params.id);
  })
  .then(() => res.send({ message: successMessages.movieDeleted }))
  .catch((err) => {
      return next(err);
  });

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
