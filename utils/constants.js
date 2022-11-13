const errorMessages = {
  nonValidURL: 'URL is not valid!',
  nonValidEmail: 'Email is not valid',
  404: '404: Страница по указанному маршруту не найдена.',
  wrongEmailOrPassword: 'Вы ввели неправильный логин или пароль.',
  userAlreadyExists: 'Пользователь с таким email уже существует!',
  userNotFound: 'Пользователь не найден!',
  cannotUpdateUser: 'Пользователь с таким email уже существует!',
  validationError: 'Ошибка валидации!',
  jwtNotFound: 'При авторизации произошла ошибка. Токен не передан или передан не в том формате.',
  expiredToken: 'При авторизации произошла ошибка. Переданный токен некорректен.',
  deleteMovie: 'Movie was already deleted or not exists',
  deleteMovieOfOtherUser: 'Cannot delete movie of other users',
  mongoIdValidity: 'Id is not valid',
  serverError: '500: На сервере произошла ошибка.',
};

const successMessages = {
  userCreated: 'User successfully created!',
  movieDeleted: 'Movie was successfully deleted',
};

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

module.exports = {
  errorMessages,
  successMessages,
  urlRegex,
};
