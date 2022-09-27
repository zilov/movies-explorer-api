const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  celebrate, Joi, isCelebrateError,
} = require('celebrate');
const { router } = require('./routes/index');
const { createUser } = require('./controllers/users');
const { checkToken } = require('./middlewares/auth');
const { login, logout } = require('./controllers/auth');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/savemoviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(cors);

app.get('/test', (req, res) => {
  res.send({message: 'Connection successful!'})
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

app.post('/signout', logout);

app.use(checkToken);

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
  console.log('Server started!');
  console.log(`Mode: ${process.env.NODE_ENV}`)
});