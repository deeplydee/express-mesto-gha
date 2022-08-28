const express = require('express');

const userRoutes = express.Router();
const {
  getUserById,
  getUsers,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.get('/:id', getUserById);
userRoutes.get('/', getUsers);
userRoutes.post('/', createUser);
userRoutes.patch('/me', updateUserProfile);
userRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = { userRoutes };
