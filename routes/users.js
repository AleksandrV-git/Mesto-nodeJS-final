/*eslint-env es6*/
const router = require('express').Router();
const {getUsers, getUserById, updateUser, updateAvatar} = require('../controllers/users.js');

router.get('/', getUsers);
router.get('/:_id', getUserById);
router.patch('/me', updateUser);
router.patch('/avatar', updateAvatar);

module.exports = router;
