const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const AuthErr = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    next(new AuthErr('Необходима авторизация'));
    return;
  }

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //     return res
  //         .status(401)
  //         .send({ message: 'Необходима авторизация' });
  // }

  // const token = authorization.replace('Bearer ', '');
  // извлечение токена полученного из заголовка authorization, const { authorization } = req.headers

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
