require('dotenv').config();
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .orFail(new Error('Not Found'))
    .then((card) => {
      if (req.user._id.toString() !== card.owner.toString()) {
        res.status(403).send({ message: `Невозможно удалить карточку, которую вы не создавали, ${req.user._id}, ${card.owner._id}` });
      } else {
        Card.deleteOne(card)
          .then(() => res.send({ data: card }))
          .catch((err) => {
            if (err.message === 'CastError') {
              res.status(400).send({ message: 'Некорректные данные' });
            } else {
              res.status(500).send({ message: 'На сервере произошла ошибка' });
            }
          });
      }
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Карточки нет в базе.' });
      } else { res.status(500).send({ message: 'На сервере произошла ошибка.' }); }
    });
};
