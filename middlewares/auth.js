const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../helpers/errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
  } else {
    let payload;

    try {
      payload = jwt.verify(token, 'SECRET');
    } catch (err) {
      next(new UnauthorizedError('Необходима авторизация'));
    }

    req.user = payload;

    next();
  }
};

module.exports = auth;
