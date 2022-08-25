const User = require('../models/user');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const getUserById = async (req, res) => {
  // get '/users/:id'
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь по указанному id не найден' });
      return;
    }
    res.status(OK).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res
        .status(BAD_REQUEST)
        .send({ message: 'Невалидный id пользователя', ...err });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

const getUsers = async (req, res) => {
  // get '/users/'
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

const createUser = async (req, res) => {
  // post '/users/'
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(CREATED).send(user);
  } catch (err) {
    if (err._message === 'user validation failed') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя',
        ...err,
      });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

const updateUserProfile = async (req, res) => {
  // patch '/users/me'
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true }
    );
    if (!user) {
      res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь с указанным id не найден' });
      return;
    }
    res.status(OK).send(user);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении профиля',
        ...err,
      });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

const updateUserAvavtar = async (req, res) => {
  // patch '/users/me/avatar'
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );
    if (!user) {
      res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь с указанным id не найден' });
      return;
    }
    res.status(OK).send(user);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении аватара',
        ...err,
      });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера', ...err });
  }
};

module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUserProfile,
  updateUserAvavtar,
};
