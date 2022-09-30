require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { router } = require('./routes/index');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { mongodbDevelopment } = require('./config');
const { errorHandler } = require('./middlewares/errorHandler');
const { NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === "production" ? MONGO_URL : mongodbDevelopment, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(cors);

app.use(router);

app.use(errorLogger);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server started!'); // eslint-disable-line
});
