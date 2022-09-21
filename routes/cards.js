const express = require('express');
const { celebrate, Joi } = require('celebrate');

const cardRoutes = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);

cardRoutes.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(
          /^(https?:\/\/)?([a-zA-z0-9%$&=?/.-]+)\.([a-zA-z0-9%$&=?/.-]+)([a-zA-z0-9%$&=?/.-]+)?(#)?$/,
        ),
    }),
  }),
  createCard,
);

cardRoutes.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteCard,
);

cardRoutes.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  likeCard,
);

cardRoutes.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  dislikeCard,
);

module.exports = { cardRoutes };
