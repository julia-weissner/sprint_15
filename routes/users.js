const userRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById } = require('../controllers/users');

userRout.get('/', getUsers);

userRout.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getUserById);

module.exports = userRout;
