const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../helpers/errors');

const getUserById = async (req, res) => { // get '/users/:id'
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь по указанному id не найден' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(BAD_REQUEST).send({ message: 'Невалидный id пользователя' });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
  }
};

const getUsers = async (req, res) => { // get '/users/'
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
  }
};

const createUser = async (req, res) => { // post '/users/'
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    res.status(CREATED).send({
      data: user.toJSON(),
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    } else if (err.code === 11000) {
      res.status(BAD_REQUEST).send({
        message: 'Пользователь с таким email уже существует',
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
      });
    }
  }
};

const updateUserProfile = async (req, res) => { // patch '/users/me'
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь с указанным id не найден' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
      return;
    }
    if (err.kind === 'ObjectId') {
      res.status(BAD_REQUEST).send({ message: 'Невалидный id пользователя' });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
  }
};

const updateUserAvatar = async (req, res) => { // patch '/users/me/avatar'
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь с указанным id не найден' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
      return;
    }
    if (err.kind === 'ObjectId') {
      res.status(BAD_REQUEST).send({ message: 'Невалидный id пользователя' });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = await jwt.sign(
      { _id: user._id },
      'SECRET',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ data: user.toJSON() });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

const getUserInfo = async (req, res) => { // get '/users/me'
  try {
    const user = await User.findById({ _id: req.user._id });
    if (!user) {
      res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь по указанному id не найден' });
      return;
    }
    // res.send(user);
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getUserInfo,
};
