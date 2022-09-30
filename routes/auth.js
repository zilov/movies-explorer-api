const router = require('express').Router();
const { createUser } = require('../controllers/users');
const { login, logout } = require('../controllers/auth');
const { postSignInValidator, postSignUpValidator } = require('../utils/joiValidators');

router.post('/signin', postSignInValidator, login);

router.post('/signup', postSignUpValidator, createUser);

router.post('/signout', logout);

module.exports = router;
