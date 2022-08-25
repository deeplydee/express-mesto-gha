const Card = require('../models/card');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const getCards = async (req, res) => { // get '/cards/'
  try {
    const cards = await Card.find({});
    res.status(OK).send(cards);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

const createCard = async (req, res) => { // post '/cards/'
  const { name, link } = req.body;
  try {
    const card = await new Card({ name, link, owner: req.user._id }).save();
    res.status(CREATED).send(card);
  } catch (err) {
    if (err._message === 'card validation failed') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки', ...err });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

const deleteCard = async (req, res) => { // delete '/cards/:cardId'
  try {
    const card = await Card.findByIdAndRemove({ _id: req.params.cardId });
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      return;
    }
    res.status(OK).send({ message: 'Карточка успешно удалена', card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки', ...err });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

const likeCard = async (req, res) => { // put '/cards/:cardId/likes'
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
      return;
    }
    res.status(OK).send({ message: 'Карточке поставлен лайк', card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка', ...err });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

const dislikeCard = async (req, res) => { // delete '/cards/:cardId/likes'
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
      return;
    }
    res.status(OK).send({ message: 'У карточки снят лайк', card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка', ...err });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
