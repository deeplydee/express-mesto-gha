const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { cardRoutes } = require('./cards');

const { NOT_FOUND_CODE } = require('../helpers/constants');

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

routes.use('/*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Не найдено' });
});

module.exports = { routes };
