const router = require('express').Router();

router.get('/test', (req, res) => {
  res.send({ message: 'Connection successful!' });
});

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

module.exports = router;