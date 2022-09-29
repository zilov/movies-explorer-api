require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  celebrate, Joi, isCelebrateError,
} = require('celebrate');
const { router } = require('./routes/index');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { mongodb } = require('./config');

mongoose.connect(mongodb, {
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

// eslint ругается на next который н используется в миддлвере, игнорирую
// eslint-disable-next-line
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    // https://github.com/arb/celebrate/issues/224 - иначе месседж пустой
    let message = '';
    // тут игнорирую генератор, без него сообщение не составить
    // eslint-disable-next-line
    for (const value of err.details.values()) {
      message += `${value.message}; `;
    }
    return res.status(400).send({ message });
  } if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res.status(404).send(err);
});

app.listen(3000, () => {
  console.log('Server started!'); // eslint-disable-line
});
