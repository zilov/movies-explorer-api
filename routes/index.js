const router = require('express').Router();
const testsRouter = require('./tests');
const authRouter = require('./auth');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { NotFoundError } = require('../controllers/errors');
const { checkToken } = require('../middlewares/auth');
const { errorMessages } = require('../utils/constants');

router.use(testsRouter);
router.use(authRouter);
router.use(checkToken);
router.use(userRouter);
router.use(moviesRouter);

router.use((req, res, next) => next(new NotFoundError(errorMessages[404])));

module.exports = { router };
