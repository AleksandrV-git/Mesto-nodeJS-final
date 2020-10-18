const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const AuthErr = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    next(new AuthErr('Необходима авторизация'));
    return;
  }
  if (!JWT_SECRET && NODE_ENV !== 'development') {
    // eslint-disable-next-line no-console
    console.log('JWT_SECRET not find');
    // eslint-disable-next-line no-undef
    next(err);
    return;
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthErr('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
