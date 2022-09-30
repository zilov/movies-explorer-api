const router = require('express').Router();
const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');
const { postMovieValidator, deleteMovieValidator } = require('../utils/joiValidators');

router.get('/movies', getMovies);

router.post('/movies', postMovieValidator, addMovie);

router.delete('/movies/:id', deleteMovieValidator, deleteMovie);

module.exports = router;
