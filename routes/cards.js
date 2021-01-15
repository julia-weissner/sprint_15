const cardRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard } = require('../controllers/cards');

cardRout.get('/', getCards);

cardRout.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((w{3}\.)*[\w.-]+\.[a-z]{2,3}))(:[1-9]\d{1,4})*(\/)?(([\w]{1,}(\/)?)+(#)?)?/),
    owner: Joi.string().hex().length(24),
    likes: Joi.array().default([]),
    createdAt: Joi.date(),
  }),
}), createCard);

cardRout.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), deleteCard);

module.exports = cardRout;
