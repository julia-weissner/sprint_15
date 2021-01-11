const cardRout = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

cardRout.get('/', getCards);
cardRout.post('/', createCard);
cardRout.delete('/:id', deleteCard);

module.exports = cardRout;
