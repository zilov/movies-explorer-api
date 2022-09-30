const router = require('express').Router();
const {
  getCurrentUser, updateUserInfo,
} = require('../controllers/users');
const { patchUserValidator } = require('../utils/joiValidators');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', patchUserValidator, updateUserInfo);

module.exports = router;
