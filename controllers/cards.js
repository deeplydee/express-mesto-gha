const Card = require('../models/card');

const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../helpers/errors');

const getCards = async (req, res) => { // get '/cards/'
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
  }
};

const createCard = async (req, res) => { // post '/cards/'
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(CREATED).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res
        .status(BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
  }
};

const deleteCard = async (req, res) => { // delete '/cards/:cardId'
  try {
    const card = await Card.findByIdAndRemove({ _id: req.params.cardId });
    if (!card) {
      res
        .status(NOT_FOUND)
        .send({ message: 'Карточка с указанным id не найдена' });
      return;
    }
    res.send({ message: 'Карточка успешно удалена', card });
  } catch (err) {
    if (err.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные для удаления карточки',
        });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
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
      res
        .status(NOT_FOUND)
        .send({ message: 'Передан несуществующий id карточки' });
      return;
    }
    res.send({ message: 'Карточке поставлен лайк', card });
  } catch (err) {
    if (err.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для постановки лайка' });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
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
      res
        .status(NOT_FOUND)
        .send({ message: 'Передан несуществующий id карточки' });
      return;
    }
    res.send({ message: 'У карточки снят лайк', card });
  } catch (err) {
    if (err.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для снятия лайка' });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
