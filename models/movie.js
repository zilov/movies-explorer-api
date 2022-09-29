const mongoose = require('mongoose');
const validator = require('validator');
const { errorMessages } = require("../utils/constants");

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: [validator.isURL, errorMessages.nonValidURL],
    required: true,
  },
  trailerLink: {
    type: String,
    validate: [validator.isURL, errorMessages.nonValidURL],
    required: true,
  },
  thumbnail: {
    type: String,
    validate: [validator.isURL, errorMessages.nonValidURL],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('movie', movieSchema);
