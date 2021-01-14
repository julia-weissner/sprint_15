require('dotenv').config();
const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new Error('Not Found'))
    .then((card) => {
      if (req.user._id.toString() !== card.owner.toString()) {
        throw new ForbiddenError('Невозможно удалить карточку, которую вы не создавали');
      } else {
        Card.deleteOne(card)
          .then(() => res.send({ data: card }))
          .catch((err) => {
            if (err.message === 'CastError') {
              next(new BadRequestError('Некорректные данные'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        next(new NotFoundError('Карточки нет в базе.'));
      } else {
        next(err);
      }
    });
};
