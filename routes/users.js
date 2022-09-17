const express = require('express');

const userRoutes = express.Router();
const {
  getUserById,
  getUsers,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.get('/:id', getUserById);
userRoutes.get('/', getUsers);
userRoutes.patch('/me', updateUserProfile);
userRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = { userRoutes };
