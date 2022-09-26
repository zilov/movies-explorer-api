const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { NotFoundError } = require('../controllers/errors');

router.use('/', userRouter);
router.use('/', moviesRouter);

router.use((req, res, next) => next(new NotFoundError('404: Page not found!')));

module.exports = { router };
