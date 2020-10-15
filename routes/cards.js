/*eslint-env es6*/
const router = require('express').Router();
const {getCards, DeleteCardById, createCard, likeCard, dislikeCard} = require('../controllers/cards.js');

router.get('/', getCards);
router.delete('/:cardId', DeleteCardById);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
