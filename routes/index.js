const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { cardRoutes } = require('./cards');

const { NotFoundError } = require('../helpers/errors/not-found-error');

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

routes.use((req, res, next) => {
  next(new NotFoundError('Не найдено'));
});

routes.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
});

module.exports = { routes };
