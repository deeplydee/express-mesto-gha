const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { cardRoutes } = require('./cards');

const NOT_FOUND = 404;

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

routes.use('*', (req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Не найдено' });
  next();
});

module.exports = { routes };
