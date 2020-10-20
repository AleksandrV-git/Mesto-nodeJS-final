const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const AuthErr = require('../errors/auth-err');
const NewErr = require('../errors/new-err');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    next(new AuthErr('Необходима авторизация'));
    return;
  }
  if (!JWT_SECRET && NODE_ENV !== 'development') {
    // eslint-disable-next-line no-console
    console.log('JWT_SECRET not find');
    next(new NewErr('На сервере произошла ошибка', 500));
    return;
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthErr('Необходима авторизация'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
