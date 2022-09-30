const errorMessages = {
  nonValidURL: 'URL is not valid!',
  nonValidEmail: 'Email is not valid',
  404: '404: Page not found!',
  userAlreadyExists: 'User is already exists! Please sign in!',
  userNotFound: 'User not found!',
  cannotUpdateUser: 'Cannot update user info!',
  validationError: 'Validation error',
  jwtNotFound: 'Cannot find JWT! Please sign in!',
  expiredToken: 'Please sign in! Token is expired, cannot find user!',
  deleteMovie: 'Movie was already deleted or not exists',
  deleteMovieOfOtherUser: 'Cannot delete movie of other users',
  mongoIdValidity: 'Id is not valid',
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
