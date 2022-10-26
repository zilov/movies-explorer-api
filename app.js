require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { default: helmet } = require('helmet');
const { router } = require('./routes/index');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { mongodbDevelopment } = require('./config');
const { errorHandler } = require('./middlewares/errorHandler');
const { rateLimiter } = require('./middlewares/rateLimiter');

const { NODE_ENV, MONGO_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : mongodbDevelopment, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(helmet());
app.use(rateLimiter);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors);
app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server started!');
});
