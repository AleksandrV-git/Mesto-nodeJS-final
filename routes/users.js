const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, updateUser, updateAvatar } = require('../controllers/users.js');

router.get('/', getUsers);

router.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().required().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/).required().min(2),
  }),
}), updateAvatar);

module.exports = router;
