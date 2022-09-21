const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { cardRoutes } = require('./cards');

const { NotFoundError } = require('../helpers/errors/not-found-error');

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('Не найдено'));
});

module.exports = { routes };
