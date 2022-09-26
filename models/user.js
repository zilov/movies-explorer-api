const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Мария',
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'Email is not valid'],
    minLength: 2,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
