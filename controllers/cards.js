/*eslint-env es6*/
const cardModel = require('../models/card.js');

module.exports.getCards = (req, res) => {
  cardModel.find({})
    .then(card => res.send({ data: card }))
    .catch(() => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));
};

module.exports.DeleteCardById = (req, res) => {
  cardModel.findById(req.params.cardId)
    .orFail(new Error('not found'))
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        res.status(403).send({ message: 'Вы не можете удалять карточки других пользователей' });
        return;
      }
      cardModel.remove();
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === "not found") {
        res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id

  cardModel.create({ name, link, owner: ownerId })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.likeCard = (req, res) =>
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(new Error('not found'))
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.message === "not found") {
        res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });

module.exports.dislikeCard = (req, res) =>
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(new Error('not found'))
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.message === "not found") {
        res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
