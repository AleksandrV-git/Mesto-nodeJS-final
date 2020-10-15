/*eslint-env es6*/
const UserModel = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.getUsers = (req, res) => {
  UserModel.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));
};

module.exports.getUserById = (req, res) => {
  UserModel.findById(req.params._id)
    .orFail(new Error('not found'))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "not found") {
        res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  let paramsObj = {};
  if (name) { paramsObj.name = name; }
  if (about) { paramsObj.about = about; }

  UserModel.findByIdAndUpdate(req.user._id, paramsObj, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(new Error('not found'))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "not found") {
        res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(new Error('not found'))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "not found") {
        res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.createUser = (req, res) => {
  let { password } = req.body;
  if (!password || password.length < 8 || /\s/.test(password)) {
    
    return res.status(400).send({ message: 'некорректный пароль' });
  }
  password = null;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const {email, name, about, avatar} = req.body;
      return UserModel.create({ name, about, avatar, email, password: hash })
    })
    .then((user) => {
      const { name, about, avatar, email, _id } = user
      res.send({ data: { name, about, avatar, email, _id } })})
    .catch((err) => {
      if (err.errors.email.message === 'Error, expected value to be unique.') {
        res.status(409).send({ message: "Переданы некорректные данные" });
      } else
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true}).end();
    })
    .catch((err) => {
      if (err.message === "Неправильные почта или пароль") {
        res.status(401).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }  
    });
}; 
