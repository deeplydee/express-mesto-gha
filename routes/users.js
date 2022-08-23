const express = require('express');

const userRoutes = express.Router();
const {
  getUserById,
  getUsers,
  createUser,
  updateUserProfile,
  updateUserAvavtar,
} = require('../controllers/users');

userRoutes.get('/:id', getUserById);
userRoutes.get('/', getUsers);
userRoutes.post('/', express.json(), createUser);
userRoutes.patch('/me', express.json(), updateUserProfile);
userRoutes.patch('/me/avatar', express.json(), updateUserAvavtar);

module.exports = { userRoutes };
