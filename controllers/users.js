/*eslint-env es6*/
const UserModel = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const NotFoundErr = require('../errors/not-found-err');
const reqErr = require('../errors/req-err');
const newErr = require('../errors/new-err');


module.exports.getUsers = (req, res, next) => {
  UserModel.find({})
    .orFail(new NotFoundErr('Запрашиваемый ресурс не найден'))
    .then(users => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  UserModel.findById(req.params._id)
    .orFail(new NotFoundErr('Запрашиваемый ресурс не найден'))
    .then(user => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  let paramsObj = {};
  if (name) { paramsObj.name = name; }
  if (about) { paramsObj.about = about; }

  UserModel.findByIdAndUpdate(req.user._id, paramsObj, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(new NotFoundErr('Запрашиваемый ресурс не найден'))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new reqErr('Переданны некорректные данные'));
      } else { next(err) }
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(new NotFoundErr('Запрашиваемый ресурс не найден'))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name !== "ValidationError") {
        next(new reqErr('Переданны некорректные данные'));
      } else { next(err) }
    });
};

module.exports.createUser = (req, res, next) => {
  let { password } = req.body;
  if (!password || password.length < 8 || /\s/.test(password)) {
    throw new reqErr('некорректный пароль');
  }
  password = null;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const { email, name, about, avatar } = req.body;
      return UserModel.create({ name, about, avatar, email, password: hash })
    })
    .then((user) => {
      const { name, about, avatar, email, _id } = user
      res.send({ data: { name, about, avatar, email, _id } })
    })
    .catch((err) => {
      if (err.errors.email.message === 'Error, expected value to be unique.') {
        next(new newErr('Переданы некорректные данные', 409))
      } else
        if (err.name === "ValidationError") {
          next(new reqErr('Переданны некорректные данные'));
        } else { next(err) }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).end();
    })
    .catch(next);// ошибка 401 обрабатывается в модели
}; 
