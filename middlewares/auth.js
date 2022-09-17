const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).send({ message: 'Необходима авторизация' });
  } else {
    let payload;

    try {
      payload = jwt.verify(token, 'SECRET');
    } catch (err) {
      res.status(401).send({ message: 'Необходима авторизация' });
    }

    req.user = payload;

    next();
  }
};

module.exports = auth;
