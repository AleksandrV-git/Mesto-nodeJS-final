const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, DeleteCardById, createCard, likeCard, dislikeCard } = require('../controllers/cards.js');

router.get('/', getCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), DeleteCardById);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/).required().min(2),
  }),
}), createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), dislikeCard);

module.exports = router;
