const userRout = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users');

userRout.get('/', getUsers);
userRout.get('/:id', getUserById);

module.exports = userRout;
