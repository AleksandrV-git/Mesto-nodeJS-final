const cardModel = require('../models/card.js');

const NotFoundErr = require('../errors/not-found-err');
const ReqErr = require('../errors/req-err');
const NewErr = require('../errors/new-err');

module.exports.getCards = (req, res, next) => {
  cardModel.find({})
    .orFail(new NotFoundErr('Запрашиваемый ресурс не найден'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.DeleteCardById = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .orFail(new NotFoundErr('Запрашиваемый ресурс не найден'))
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        throw new NewErr('Вы не можете удалять карточки других пользователей', 403);
      }
      cardModel.remove();
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  cardModel.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErr('Переданны некорректные данные'));
      } else { next(err); }
    });
};

module.exports.likeCard = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(new NotFoundErr('Запрашиваемый ресурс не найден'))
  .then((card) => res.send({ data: card }))
  .catch(next);

module.exports.dislikeCard = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail(new NotFoundErr('Запрашиваемый ресурс не найден'))
  .then((card) => res.send({ data: card }))
  .catch(next);
